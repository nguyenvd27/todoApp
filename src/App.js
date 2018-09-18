import React, { Component } from 'react';
import './App.css';
import TaskForm from './Components/TaskForm';
import Control from './Components/Control';
import TaskList from './Components/TaskList';

class App extends Component {

        constructor(props){
            super(props);
            this.state={
                tasks: [],
                isDisplayForm : false,
                taskEditing : null,
                filter : {
                  name : ' ',
                  status : -1
                }
            }
            this.onToggleForm=this.onToggleForm.bind(this);
            this.onCloseForm=this.onCloseForm.bind(this);
        }

        componentWillMount(){
            if(localStorage && localStorage.getItem('tasks')){
                var tasks = JSON.parse(localStorage.getItem('tasks'));
                this.setState({
                    tasks : tasks
                });
            }
        }

        s4(){
            return Math.floor((1+Math.random())* 0x10000).toString(16).substring(1);
        }

        generateID(){
            return this.s4() + this.s4()+ '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + this.s4()  ;
        }

        onToggleForm(){
            this.setState({
                isDisplayForm: true,
                taskEditing : null
            });
        }

        onShowForm(){
             this.setState({
                isDisplayForm: true
            });
        }

        onCloseForm(){
            this.setState({
                isDisplayForm: false
            });
        }

        onSubmit = (data) => {
            var { tasks } = this.state;
            if(data.id === ' ' ){
                data.id = this.generateID();
                tasks.push(data);
            }else{
              //Editing
                var index = this.findIndex(data.id);
                tasks[index] = data;
            }
            
            this.setState({
                tasks : tasks,
                taskEditing : null
            });
            localStorage.setItem('tasks',JSON.stringify(tasks));
        }

        onUpdateStatus = (id) => {
            var { tasks } = this.state;
            var index = this.findIndex(id);
            if( index !== -1 ){
                tasks[index].status = !tasks[index].status;
                this.setState({
                    tasks : tasks
                });
                localStorage.setItem('tasks',JSON.stringify(tasks));
            }
        }
        findIndex= (id ) => {
            var { tasks } = this.state;
            var result = -1;
            tasks.forEach((task,index ) => {
                if( task.id === id ){
                    result = index ;
                }
            });
            return result;
        }

        onDelete = (id ) => {
            var { tasks } = this.state;
            var index = this.findIndex(id);
            if( index !== -1 ){
                tasks.splice(index, 1);
                this.setState({
                    tasks : tasks
                });
                localStorage.setItem('tasks',JSON.stringify(tasks));
            }
            this.onCloseForm();
        }

        onUpdate = (id ) => {
            var { tasks } = this.state;
            var index = this.findIndex(id);
            var taskEditing = tasks[index];
            this.setState({
                taskEditing : taskEditing
            });
            this.onShowForm();
        } 

        onFilter = (filterName, filterStatus) => {
          filterStatus = parseInt(filterStatus, 10);
         this.setState({
          filter : {
            name : filterName.toLowerCase(),
            status : filterStatus
          }
         })
        }
      render() {
        var {tasks, isDisplayForm, taskEditing, filter } = this.state; //giong voi var tasks = this.state.tasks
        if(filter){
          if(filter.name){
            tasks = tasks.filter( (task)=> {
              return task.name.toLowerCase().indexOf(filter.name) !== -1;
            });
          }
          tasks = tasks.filter((task) => {
              if( filter.status === -1 ){
                return task;
              }else{
                return task.status === ( filter.status === 1 ? true : false )
              }
            });
        }
        var elmTaskForm = isDisplayForm  ? <TaskForm 
                                                                            onSubmit_props = { this.onSubmit} 
                                                                            onCloseForm={ this.onCloseForm } 
                                                                            task = { taskEditing }
                                                                    /> : ' ';
            return (
                <div className="container">
                    <div className="text-center">
                        <h1>Quản Lý Công Việc</h1><hr/>
                    </div>
                    <div className="row">
                        <div className= { isDisplayForm ? 'col-xs-4 col-sm-4 col-md-4 col-lg-4' : '' } >
                    {/*form*/}
                            {/*<TaskForm />*/}
                            { elmTaskForm }
                        </div>
                        <div className={ isDisplayForm ? 'col-xs-8 col-sm-8 col-md-8 col-lg-8' : 'col-xs-12 col-sm-12 col-md-12 col-lg-12' }>
                            <button 
                                type="button" 
                                className="btn btn-primary" 
                                onClick = {this.onToggleForm }
                            >
                                <span className="fa fa-plus mr-5" ></span>Thêm Công Việc
                            </button>
                            &nbsp;

                            {/*Search -Sort */}
                            <div className="row mt-15">
                                <Control />
                                {/*List*/}
                                <div className="row" >
                                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 mt-15" >
                                        <TaskList 
                                            tasks_props ={ tasks} 
                                            onUpdateStatus_props = { this.onUpdateStatus } 
                                            onDelete = {this.onDelete }
                                            onUpdate = { this.onUpdate }
                                            onFilter = { this.onFilter }
                                        />
                                    </div>
                                </div>
                            </div>                          
                        </div>
                    </div>
                </div>
            );
      }
}

export default App;
