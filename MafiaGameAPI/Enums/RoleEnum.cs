using System;

namespace MafiaGameAPI.Enums
{
    [Flags]
    public enum RoleEnum
    {
        Mafioso = 1,
        Ghost = 2,
        Citizen = 4,
    }
}
