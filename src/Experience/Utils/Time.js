import EventEmitter from './EventEmitter.js'

export default class Time extends EventEmitter
{
    start()
    {
        this.startTime = performance.now()
        this.current = this.startTime
        this.elapsed = 0
        this.tick = (now) => {
            this.delta = now - this.current
            this.current = now
            this.elapsed = now - this.startTime
            this.frame = window.requestAnimationFrame(this.tick)
            this.trigger('tick')
        }
        this.frame = window.requestAnimationFrame(this.tick)
    }

    destroy()
    {
        window.cancelAnimationFrame(this.frame)
        this.off('tick')
    }
}
