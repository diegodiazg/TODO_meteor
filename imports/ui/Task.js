import React, { Component } from 'react';
import { Tasks } from '../api/tasks.js';
import ReactDOM from 'react-dom';

// Task component - represents a single todo item
export default class Task extends Component {
	toggleChecked() {
    // Set the checked property to the opposite of its current value
    Tasks.update(this.props.task._id, {
      $set: { checked: !this.props.task.checked },
    });
  }

updateTask() {
    // Set the checked property to the opposite of its current value
    Tasks.update(this.props.task._id, {
      $set: { text: ReactDOM.findDOMNode(this.refs.textTask).value.trim() },
    });
  }

 
  deleteThisTask() {
    Tasks.remove(this.props.task._id);
  }

  render() {
  	    const taskClassName = this.props.task.checked ? 'checked' : '';

    return (
    	<li className={taskClassName}>
              <button className="delete" onClick={this.deleteThisTask.bind(this)}>
                &times;
              </button>
       
              <input
                type="checkbox"
                readOnly
                checked={!!this.props.task.checked}
                onClick={this.toggleChecked.bind(this)}
              />
       
              <span className="text">
             <strong>{this.props.task.username}</strong>: <input ref="textTask" onChange={this.updateTask.bind(this) } type="text" value={this.props.task.text} />
              </span>
            </li>
    );
  }
}



