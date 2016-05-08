import * as React from 'react';

import {Controlls} from './controlls.component';

export class Memo extends React.Component<Props, State> {
    constructor(props){
        super(props);
        this.state = {
            cards: [],
            setSize: 0,
            clickLock: false
        };
    }
    render(){
        return (
            <div className="container">
                <div className="game">
                {
                    this.state.cards.map((card,index)=>{
                        return (
                            <div key={index} className={"card " + (card.state !== "normal" ? card.state : "")} onClick={()=>{this.cardClick(card, index)}}>
                                <figure className="front"></figure>
                                <figure className="back">
                                    <i className={"fa fa-"+card.class}/>
                                    <div>{card.setIndex}</div>
                                </figure>
                            </div>
                        )
                    })
                }
                </div>
                <div className="timer">{this.state.won?"You matched all cards in "+Memo.timePad(this.state.timer)+" with " + this.state.clicks + " clicks":Memo.timePad(this.state.timer)}</div>
                <Controlls onStart={(sets,size)=>this.start(sets,size)}></Controlls>
            </div>
        )
    }

    start(sets: number, size: number){
        clearInterval(this.state.timerId)
        let cards: Card[] = [];
        let s:number = sets;
        let icons:string[] = Memo.shuffle(Memo.icons).slice(0,sets);
        while(s){
            for(let i=0;i<size;i++){
                cards.push({
                    class: icons[s-1],
                    state: "normal",
                    setIndex: s
                });
            }
            s--;
        }
        cards = Memo.shuffle(cards);
        this.setState({
            cards: cards,
            setSize: +size,
            setCount: +sets,
            timer: 0,
            timerId: setInterval(()=>{this.timerTick()}, 1000),
            won: false,
            clickLock: false,
            clicks: 0
        });
    }

    timerTick(){
        this.setState(prev=>{return{timer: prev.timer+1}});
    }

    cardClick(card: Card, index: number){
        this.setState(prev=>{return{clicks: prev.clicks+1}});
        if(card.state !== "normal" || this.state.clickLock)return;

        if(this.flippedCount + 1 === this.state.setSize && this.isClassMatch(card.class)){
            this.match(index);
        }else{
            card = Object.assign(card, {state: "flipped"});
            this.setState({
                cards: Memo.replace(this.state.cards, index, card)
            })
            if(!this.isClassMatch(card.class)){
                this.fail();
            }
        }
    }

    fail(){
        this.setState({clickLock: true});
        setTimeout(()=>{
            let cards = this.state.cards;
            for(let i in cards){
                if(cards[i].state === 'flipped'){
                    cards = Memo.replace(cards, +i, Object.assign(cards[i], {state: "normal"}))
                }
            }
            this.setState({
                cards: cards,
                clickLock: false
            })
        },1000)
    }

    match(index){
        let matchedCount = 0;
        let cards = this.state.cards;
        for(let i in cards){
            if(cards[i].state === 'matched'){
                matchedCount++;
            } else if(cards[i].state === 'flipped' || +i === +index){
                cards = Memo.replace(cards, +i, Object.assign(cards[i], {state: "matched"}))
                matchedCount++;
            }
        }
        this.setState({
            cards: cards
        })
        if(matchedCount === this.state.setSize * this.state.setCount){
            clearInterval(this.state.timerId)
            this.setState({won: true})
        }
    }

    private isClassMatch(className: string): boolean{
        for(let i in this.state.cards){
            if(this.state.cards[i].state === 'flipped' && this.state.cards[i].class !== className){
                return false;
            }
        }
        return true;
    }

    private get flippedCount(): number{
        let count = 0;
        for(let i in this.state.cards){
            if(this.state.cards[i].state === 'flipped'){
                count ++;
            }
        }
        return count;
    }

    private static icons = ['anchor', 'automobile', 'balance-scale', 'bell',
	'bed', 'bicycle', 'bomb', 'camera', 'child',
	'cloud', 'cube', 'diamond', 'eye', 'envelope',
	'gift', 'glass', 'heart', 'leaf', 'paw', 'plus',
	'recycle', 'rocket', 'ship', 'smile-o'];

    private static timePad(time: number): string{
        return Math.floor(time / 60) + ':' + Memo.lPad('0', 2, "" + (time % 60));
    }

    private static lPad(padString: string, length: number, str: string): string {
    	while (str.length < length)
    		str = padString + str;
    	return str;
    }


    private static replace<T>(array: T[], index: number, item: T): T[] {
        return [].concat(array.slice(0, index), item, array.slice(index+1));
    }

    //http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    private static shuffle<T>(array: T[]): T[] {
    	let currentIndex = array.length, temporaryValue, randomIndex;
        let shuffledArray = array.concat([]);

    	// While there remain elements to shuffle...
    	while (0 !== currentIndex) {

    		// Pick a remaining element...
    		randomIndex = Math.floor(Math.random() * currentIndex);
    		currentIndex -= 1;

    		// And swap it with the current element.
    		temporaryValue = shuffledArray[currentIndex];
    		shuffledArray[currentIndex] = shuffledArray[randomIndex];
    		shuffledArray[randomIndex] = temporaryValue;
    	}

    	return shuffledArray;
    }
}

interface Props{}
interface State{
    cards?: Card[],
    setSize?: number,
    setCount?: number,
    clickLock?: boolean,
    timer?: number,
    timerId?: any,
    clicks?: number,
    won?: boolean
}

interface Card {
    state: CardState
    class: string
    setIndex: number
}
type CardState = "matched" | "flipped" | "normal";
