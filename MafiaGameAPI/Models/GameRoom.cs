using System;
using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace MafiaGameAPI.Models 
{
	public class GameRoom 
	{

		public string Id { get; set; }
		public List<GameState> GameHistory { get; set; }
		public String Name { get; set; }
		public String Password { get; set; }
		public GameOptions GameOptions { get; set; }
		public User Owner { get; set; }
		public String GroupName { get; set; }
		public List<string> Participants { get; set; }
		public bool IsGameStarted { get; set; }

		public GameRoom(string name, User owner)
		{
			Name = name;
			Owner = owner;
			GameOptions = new GameOptions();
			GameHistory = new List<GameState>();
			Participants = new List<string>();
			Participants.Add(owner.Id);
			IsGameStarted = false;
		}
	}

}
