import {
    app,
    HttpHandler,
    HttpRequest,
    HttpResponse,
    InvocationContext,
} from '@azure/functions';
import * as df from 'durable-functions';
import {
    ActivityHandler,
    OrchestrationContext,
    OrchestrationHandler,
} from 'durable-functions';
import { z, ZodError } from 'zod';
import dayjs from 'dayjs';

const requestSchema = z.object({
    turnEnd: z
        .string()
        .transform(val => dayjs(val, undefined, true))
        .refine(val => val.isValid())
        .transform(val => val.toISOString()),
    callbackToken: z.string(),
    callbackUrl: z.string(),
});

type Data = z.infer<typeof requestSchema>;

const changeTurnActivityName = 'changeTurn';
const orchestratorName = 'turnChangerOrchestrator';

const turnChangerOrchestrator: OrchestrationHandler = function* (
    context: OrchestrationContext,
) {
    const { turnEnd: turnEndStr, ...data } = context.df.getInput() as Data;

    const turnEnd = dayjs(turnEndStr);

    context.log('Waiting until the turn ends', turnEnd.toISOString());
    yield context.df.createTimer(turnEnd.toDate());
    context.log('Turn ended, calling the chage turn activity');
    yield context.df.callActivity(changeTurnActivityName, data);
};
df.app.orchestration(orchestratorName, turnChangerOrchestrator);

const changeTurn: ActivityHandler = async (
    { callbackToken, callbackUrl }: Omit<Data, 'turnEnd'>,
    context,
) => {
    context.log('Calling the change turn endpoint', callbackUrl);
    await fetch(callbackUrl, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${callbackToken}`,
        },
    });
};
df.app.activity(changeTurnActivityName, { handler: changeTurn });

const turnChangerHttpStart: HttpHandler = async (
    request: HttpRequest,
    context: InvocationContext,
): Promise<HttpResponse> => {
    const client = df.getClient(context);
    try {
        const data = requestSchema.parse(await request.json());
        const instanceId = await client.startNew(orchestratorName, {
            input: data,
        });

        context.log(`Started orchestration with ID = '${instanceId}'.`);

        return client.createCheckStatusResponse(request, instanceId);
    } catch (e) {
        if (e instanceof ZodError) {
            return new HttpResponse({
                status: 400,
                body: e.toString(),
                headers: [['Content-Type', 'application/json']],
            });
        }

        if (e instanceof SyntaxError) {
            return new HttpResponse({
                status: 400,
                body: 'Invalid JSON input',
                headers: [['Content-Type', 'text/plain']],
            });
        }

        throw e;
    }
};

app.http('turnChangerHttpStart', {
    route: 'start-turn-timer',
    methods: ['POST'],
    authLevel: 'function',
    extraInputs: [df.input.durableClient()],
    handler: turnChangerHttpStart,
});
