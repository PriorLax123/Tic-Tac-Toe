# Tic-Tac-Toe

There are three different settings displayed on the top of the page{PlayerMode, Difficulty, FirstPlayer}

PlayerMode{1 Player, 2 Player}:
    The player mode determines if you will be playing with two players, or if you will be playing against a CPU  
    NOTE: In 1 Player mode the player will always be X

Difficulty{Easy, Medium, Hard}:
    The difficulty is only applicible to 1 Player Mode and determines the level of difficulty of the CPU
    
Easy:   This CPU's moves are mostly random as it moves to one of the corners 60% of the time, the center 30% of the time, and an edge 10% of the time.

Medium: This CPU is smart enough to win if it can in and prevent the opponent from winning, but only in the case that either the player is one away for
        winning or it will win by placing down the piece. If neither of these conditions are met, then it will fall back to the Easy decision.

Hard:   This CPU uses the minimax value of every potential play to make the best move based on heuristic value. This makes it impossible to beat, but
        is a good represention of how to make a best move in any case. The minimax is not perfect, but it gurentees that the CPU will never lose, and that 
        if there is a way for it to win, that the CPU will find it.

FirstPlayer{X First, O First}:
    Allows a user to pick if they want X or O to go first


Author: Jackson Mishuk
