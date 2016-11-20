import React, {Component} from 'react';
import {connect} from 'react-redux';
import {selector} from 'modules/subjects/reducers/reducer';
import * as actionCreators from 'modules/subjects/reducers/actionCreators';
import {DragSource, DragDropContext, DropTarget, DragLayer} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

@DragSource('subject', {
    beginDrag(props, monitor, component){
        return props;
    }
}, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
    connectDragPreview: connect.dragPreview()
}))
class SubjectDisplay extends Component {
    render(){
        let {_id, name, connectDragSource, connectDragPreview} = this.props;

        return (
            connectDragPreview(<li key={_id}>{connectDragSource(<i className="fa fa-fw fa-arrows"></i>)} {name}</li>)
        )
    }
}

@DropTarget('subject', {}, (connect, monitor) => ({
    // Call this function inside render()
    // to let React DnD handle the drag events:
    connectDropTarget: connect.dropTarget(),
    // You can ask the monitor about the current drag state:
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType()
}))
class TempDrop extends Component {
    render(){
        let { isOver, canDrop, connectDropTarget } = this.props;

        return connectDropTarget(
            <div style={{ border: '1px solid red', height: '300px;' }}>
                <br />
                <br />
                <br />
                <br />
                <br />
            </div>
        );
    }
}

export default class SubjectsList extends Component{
    render(){
        return (
            <div style={{ margin: '50px' }}>
                <ul>{this.props.subjects.map(subject => <SubjectDisplay {...subject} />)}</ul>

                <br />
                <br />
                <br />
                <TempDrop />
            </div>
        )
    }
}

const SubjectsListConnected = connect(selector, { ...actionCreators })(SubjectsList);

export default DragDropContext(HTML5Backend)(SubjectsListConnected);