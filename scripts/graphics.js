function drawRect(ctx, x, y, width, height, radius, strokewidth, strokeStyle, fillStyle){
		
	ctx.beginPath();
      ctx.moveTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height -radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius , y + height);
 	ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
 	ctx.lineTo(x, y + radius );
 	ctx.closePath();
 	ctx.fillStyle = fillStyle;
 	ctx.fill();
 	
      if (strokewidth != 0){


 	ctx.lineWidth = strokewidth;
      ctx.strokeStyle = strokeStyle;
      ctx.stroke();

  }
}


function drawText(ctx, text, x, y, font, fill, align)
{
      ctx.font = font
      ctx.textAlign = align
      ctx.fillStyle = fill
      ctx.fillText(text, x, y)
}