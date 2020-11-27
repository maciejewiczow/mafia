using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace MafiaGameAPI.Models
{
    public class Message
    {
        [BsonId]
        public ObjectId Id { get; set; }
        public String UserId { get; set; }
        public DateTime SentAt { get; set; }
        public String Content { get; set; }
        public String GroupName { get; set; }
    }
}
