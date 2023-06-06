import React, { useEffect, useRef } from 'react'

const Canvas = props => {
    const canvasRef = useRef(null)

    const draw = (ctx) => {
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        ctx.fillStyle = '#000000'

    }

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        
        
        draw(context)
    },[draw])


    return <canvas ref={canvasRef} {...props}/>
} 

export default Canvas