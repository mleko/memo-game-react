import * as React from 'react';

export class Controlls extends React.Component<Props, State> {
    constructor(props){
        super(props)
        this.state = {
            sets: 5,
            size: 2
        }
    }

    render(){
        return (
            <div className="controls">
                <span style={{padding: "15px", backgroundColor: "#ccf", borderRadius: '10px'}}>
                <label htmlFor="sets">Numer of sets:</label>
                <input type="number" min="2" step="1" onChange={e=>{this.setState({sets: e.target['value']})}} value={String(this.state.sets)}/>
                <label htmlFor="setSize">Set size:</label>
                <input type="number" min="2" step="1" onChange={e=>{this.setState({size: e.target['value']})}} value={String(this.state.size)}/>
                <span className="button" onClick={()=>this.click()}>Start</span></span>
            </div>
        );
    }

    click(){
        this.props.onStart && this.props.onStart(this.state.sets, this.state.size)
    }

    componentDidMount(){
        this.click()
    }
}

interface Props{
    onStart: (sets: number, size: number)=>void
}
interface State{
    sets?: number,
    size?: number
}
