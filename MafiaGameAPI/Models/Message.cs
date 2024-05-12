using System;
using MafiaGameAPI.Enums;
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
        public String RoomId { get; set; }

        public ChatTypeEnum ChatType { get; set; }
    }
}
