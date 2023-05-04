const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    attendance: [{
      date: {
        type: Date,
        required: true,
      },
      present: {
        type: Boolean,
        default: false,
      },
    }],
    salary: {
      type: Number,
      required: true,
    },
    
    media: {
        type: String,
        default: null
      },


  });
  

  

const salarySchema = new mongoose.Schema({
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker',
    required: true,
  },
  month: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

const taskSchema = new mongoose.Schema({
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Worker',
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'in progress', 'completed'],
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    reward: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  }, { timestamps: true });


  const attendanceSchema = new mongoose.Schema({
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Worker',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    present: {
      type: Boolean,
      default: false,
    },
  }, { timestamps: true });
  
  const Worker = mongoose.model('Worker', workerSchema);
  const Task = mongoose.model('Task', taskSchema);
  const Salary = mongoose.model('Salary', salarySchema);
  const Attendance = mongoose.model('Attendance', attendanceSchema);
  
  module.exports = { Worker, Task, Salary, Attendance };
