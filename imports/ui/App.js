import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import {Treebeard} from 'react-treebeard';

import { withTracker } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';
import { Tasks } from '../api/tasks.js';
import * as filters from './filter';

import Task from './Task.js';
import AccountsUIWrapper from './AccountsUIWrapper.js';
const data = {
    name: 'root',
    toggled: true,
    children: [
        {
            name: 'parent',
            children: [
                { name: 'child1' },
                { name: 'child2' }
            ]
        },
        {
            name: 'loading parent',
            loading: true,
            children: []
        },
        {
            name: 'parent',
            children: [
                {
                    name: 'nested parent',
                    children: [
                        { name: 'nested child 1' },
                        { name: 'nested child 2' }
                    ]
                }
            ]
        }
    ]
};


// App component - represents the whole app
class App extends Component {
    constructor(props) {
        super(props);
     
        this.state = {
          hideCompleted: false,
        }; 
        this.onToggle = this.onToggle.bind(this);
    }

    onToggle(node, toggled){
        if(this.state.cursor){this.state.cursor.active = false;}
        node.active = true;
        if(node.children){ node.toggled = toggled; }
        this.setState({ cursor: node });
    }



    handleSubmit(event) {
        event.preventDefault(); 
        // Find the text field via the React ref
        const name = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
        const father ="";
       /* Tasks.insert({
            text,
            createdAt: new Date(), // current time
            owner: Meteor.userId(),           // _id of logged in user
            username: Meteor.user().username,  // username of logged in user
            father
        });*/
        Tasks.insert({
            name,
            children:[],
            active:true,
            createdAt: new Date(), // current time
            owner: Meteor.userId(),           // _id of logged in user
            username: Meteor.user().username,  // username of logged in user
                    
         });

        // Clear form
        ReactDOM.findDOMNode(this.refs.textInput).value = '';
    }

    toggleHideCompleted() {
        this.setState({
            hideCompleted: !this.state.hideCompleted,
        });
    }
      onFilterMouseUp(e) {
        const filter = e.target.value.trim();
        if (!filter) {
            return this.setState({data});
        }
        var filtered = filters.filterTree(data, filter);
        filtered = filters.expandFilteredNodes(filtered, filter);
        this.setState({data: filtered});
    }

    renderTasks() {
        let filteredTasks = this.props.tasks;
        if (this.state.hideCompleted) {
            filteredTasks = filteredTasks.filter(task => !task.checked);
        }
        return filteredTasks.map((task) => (
            <Task key={task._id} task={task} />
        ));
    }
      
         
  

    render() {
        return (
            <div className="container">
                <label className="hide-completed">
                    <input type="checkbox" 
                        readOnly 
                        checked={this.state.hideCompleted} 
                        onClick={this.toggleHideCompleted.bind(this)}
                    />
                   Hide Completed Tasks
                </label>
                <header>
                    <h1>Todo List ({this.props.incompleteCount})</h1>
                    <AccountsUIWrapper />
                    { this.props.currentUser ?
                        <form className="new-task" onSubmit={this.handleSubmit.bind(this)} >
                            <input type="text"
                                ref="textInput"
                                placeholder="Type to add new tasks"
                            />
                        </form> : ''
                    }
                </header>
                <ul>
                    {this.renderTasks()}
                </ul>
                <div >
                    <div className="input-group">
                        <span className="input-group-addon">
                          <i className="fa fa-search"/>
                        </span>
                        <input className="form-control"
                               onKeyUp={this.onFilterMouseUp.bind(this)}
                               placeholder="Search the tree..."
                               type="text"/>
                    </div>
                </div>
                <Treebeard
                data={data}
                onToggle={this.onToggle}
            />
            </div>

            );
        }
    }

export default withTracker(() => {
  return {
     tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
     incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
     currentUser: Meteor.user(),
  };
})(App);


