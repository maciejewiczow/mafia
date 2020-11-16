using System;

namespace MafiaGameAPI.Hubs
{
    public class GameHub
    {
        private MafiaGameAPI.Services.IGameService _gameService;

        public MafiaGameAPI.Models.GameState StartGame()
        {
            throw new System.NotImplementedException("Not implemented");
        }
        public MafiaGameAPI.Models.GameRoom JoinRoom(ref String roomId)
        {
            throw new System.NotImplementedException("Not implemented");
        }
        public bool Vote(ref String votedUserId)
        {
            throw new System.NotImplementedException("Not implemented");
        }
        public void OnConnect()
        {
            throw new System.NotImplementedException("Not implemented");
        }

    }

}
