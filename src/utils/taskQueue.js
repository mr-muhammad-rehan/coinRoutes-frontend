class TaskQueue {
    constructor(interval = 50) {
      this.queue = [];
      this.interval = interval;
      this.timer = null;
    }
  
    addTask(task) {
      this.queue.push(task);
      if (!this.timer) {
        this.start();
      }
    }
  
    start() {
      this.timer = setInterval(() => {
        if (this.queue.length > 0) {
          const task = this.queue.shift();
          task();
        } else {
          this.stop();
        }
      }, this.interval);
    }
  
    stop() {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
  
  export default TaskQueue;