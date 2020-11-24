using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace MafiaGameAPI.Models
{
    public class UserProjection
    {
        [BsonId]
        public string Id { get; set; }
        public string Name { get; set; }
        public string RoomId { get; set; }
    }
}
