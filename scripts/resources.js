var tetro_hit = new Audio("audio/Blip2.wav")
	tetro_hit.preload = "auto"


var imgSrc     = [{ name : "pressEnter",  src :"img/pressEnter.png" },
			 	  { name : "gameOver",    src :"img/gameOver.png"   },
			 	  { name : "title",       src :"img/title.png"      },
			     ]

var imgs = {}

var imgLoadedCounter = 0

loadImages = function(){

	for (var i = 0; i < imgSrc.length; i++)
	{
		imgs[imgSrc[i]['name']] = new Image()
		imgs[imgSrc[i]['name']].addEventListener('load', function(){imgLoadedCounter++})
		imgs[imgSrc[i]['name']].src = imgSrc[i]['src']
	}
}

loadImages()