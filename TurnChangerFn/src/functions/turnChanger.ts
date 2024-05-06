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

    if (turnEnd.isBefore(dayjs())) {
        return;
    }

    yield context.df.createTimer(turnEnd.toDate());
    yield context.df.callActivity(changeTurnActivityName, data);
};
df.app.orchestration(orchestratorName, turnChangerOrchestrator);

const changeTurn: ActivityHandler = async ({
    callbackToken,
    callbackUrl,
}: Omit<Data, 'turnEnd'>) => {
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
            });
        }

        if (e instanceof SyntaxError) {
            return new HttpResponse({
                status: 400,
                body: 'Invalid JSON input',
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
