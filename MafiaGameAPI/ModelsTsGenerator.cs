using System;
using System.Collections.Generic;
using TypeGen.Core.Extensions;
using TypeGen.Core.SpecGeneration;

namespace MafiaGameAPI
{
    public class ModelsTsGenerator : GenerationSpec
    {
        public override void OnBeforeGeneration(OnBeforeGenerationArgs args)
        {
            IEnumerable<Type> types = GetType().Assembly.GetTypes();

            foreach (var type in types)
            {
                if (type.Namespace == null)
                    continue;

                if (type.Namespace.StartsWith("MafiaGameAPI.Models") && type.IsClass)
                    AddClass(type);

                if (type.Namespace.StartsWith("MafiaGameApi.Enums") && type.IsEnum)
                    AddEnum(type);
            }
        }

        public override void OnBeforeBarrelGeneration(OnBeforeBarrelGenerationArgs args)
        {
            // equivalent to AddBarrel("."); adds one barrel file in the global TypeScript output directory containing all files and directories from that directory
            AddBarrel(".", BarrelScope.Files | BarrelScope.Directories);
        }
    }
}
