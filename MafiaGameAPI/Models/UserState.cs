using MafiaGameAPI.Enums;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace MafiaGameAPI.Models
{
    public class UserState
    {
        public string UserId { get; set; }
        [JsonConverter(typeof(StringEnumConverter))]
        public RoleEnum Role { get; set; }
    }
}
