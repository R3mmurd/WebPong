function updatePaddle(dt) {
  var next_y = this.y + this.vy*dt
  if (this.vy < 0){
    this.y = Math.max(0, next_y)
  } else {
    this.y = Math.min(720-60, next_y)
  }
}

function renderObject() {
  $("#"+this.id).css({
    "left": "" + this.x + "px",
    "top": "" + this.y + "px"
  })
}

function gameLoop() {
  var endTime = new Date()
  var dt = (endTime - startTime)/1000

  game.update(dt)
  game.render()

  startTime = endTime
}

$(function() {

  game = {
    state: "serving",
    serving: 0,
    score1: 0,
    score2: 0,
    paddle1: {
      id: "paddle1",
      x: 30,
      y: 90,
      vy: 0,
      update: updatePaddle,
      render: renderObject,
      reset: function() {
        this.y = 90
      }
    },
    paddle2: {
      id: "paddle2",
      x: 1230,
      y: 570,
      vy: 0,
      update: updatePaddle,
      render: renderObject,
      reset: function() {
        this.y = 570
      }
    },
    ball: {
      id: "ball",
      x: 634,
      y: 354,
      vx: 150,
      vy: 110,
      render: renderObject,
      update: function(dt) {
        this.x = this.x + this.vx*dt
        this.y = this.y + this.vy*dt
      },
      collides: function(paddle) {
        if (this.x > paddle.x + 15 || paddle.x > this.x + 12) {
          return false
        }

        if (this.y > paddle.y + 60 || paddle.y > this.y + 12) {
          return false
        }

        return true
      },
      reset: function() {
        this.x = 634
        this.y = 354,
        this.vx = 0
        this.vy = 0
      }
    },

    reset: function() {
      this.paddle1.reset()
      this.paddle2.reset()
      this.ball.reset()
      this.serving = Math.floor(Math.random()*2 + 1)
      this.score1 = 0
      this.score2 = 0
      this.state = 'serving'
    },

    update: function(dt) {
      this.paddle1.update(dt)
      this.paddle2.update(dt)
      this.ball.update(dt)

      if (this.ball.y < 0) {
        this.ball.y = 0
        this.ball.vy *= -1
      } else if (this.ball.y > 708) {
        this.ball.y = 708
        this.ball.vy *= -1
      }

      if (this.ball.collides(this.paddle1)) {
        this.ball.x = this.paddle1.x + 15
        this.ball.vx = -this.ball.vx + Math.random()*20+10
        game.ball.vy += Math.random() * 20 + 10
      }

      if (this.ball.collides(this.paddle2)) {
        this.ball.x = this.paddle2.x - 12
        this.ball.vx = -this.ball.vx - (Math.random()*20+10)
        game.ball.vy += Math.random() * 20 + 10
      }

      if (this.ball.x > 1268) {
        this.ball.reset()
        this.score1 += 1
        this.serving = 2
        $("#btn").removeAttr('disabled')
        this.state = 'serving'

        if (this.score1 == 5) {
          this.state = 'game-over'
          $("#btn").prop("value", "Click to play again")
          $("#message").text("Player 1 wins!")
        }
      }

      if (this.ball.x < 0) {
        this.ball.reset()
        this.score2 += 1
        this.serving = 1
        $("#btn").removeAttr('disabled')
        this.state = 'serving'

        if (this.score2 == 5) {
          this.state = 'game-over'
          $("#btn").prop("value", "Click to play again")
          $("#message").text("Player 2 wins!")
        }
      }
    },
    render: function() {
      this.paddle1.render()
      this.paddle2.render()
      this.ball.render()

      $("#score1").text(this.score1)
      $("#score2").text(this.score2)
    }
  }
  game.reset()
  startTime = new Date()
  setInterval(gameLoop, 33)

  $("#btn").click(function() {
    if (game.state == "serving") {
      game.ball.vy = Math.random() * 300 - 150
      if (game.serving == 1) {
        game.ball.vx = Math.random() * 60 + 220
      } else {
        game.ball.vx = -(Math.random() * 60 + 220)
      }
      $("#btn").prop('disabled', 'disabled')
      $("#message").text("")
      game.state = 'playing'
    } else if (game.state == 'game-over') {
      game.reset()
      $("#btn").prop('value', 'Click to Serve')
      $("#message").text("Click the button to serve")
    }
  })
}).keypress(function(event) {
  if (game.state != 'playing') {
    return
  }
  if (event.charCode == 119) {
    game.paddle1.vy = -300
  } else if (event.charCode == 115) {
    game.paddle1.vy = 300
  } else if (event.charCode == 111) {
    game.paddle2.vy = -300
  } else if (event.charCode == 108) {
    game.paddle2.vy = 300
  }
}).keyup(function(event) {
   game.paddle1.vy = 0
   game.paddle2.vy = 0
});
