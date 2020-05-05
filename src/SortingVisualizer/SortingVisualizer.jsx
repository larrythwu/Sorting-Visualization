import React from 'react';
import {getMergeSortAnimations} from '../sortingAlgorithms/sortingAlgorithms.js';
import './sortingVisualizer.css';
import {Button} from '../components/Button.jsx'

// Change this value for the number of bars (value) in the array.
const NUMBER_OF_ARRAY_BARS = 100;

// This is the main color of the array bars.
const PRIMARY_COLOR = 'turquoise';

// This is the color of array bars that are being compared throughout the animations.
const SECONDARY_COLOR = 'red';

//animation speed ms
let ANIMATION_SPEED = 30;

//stop a certain sorting process
let STOP = false;

//indicate if a sorting is already running
let RUNNING = false;


//current array
const arrayBars = document.getElementsByClassName('array-bar');

export default class SortingVisualizer extends React.Component {
  constructor(props) {
    super(props);

  this.state = {
      array: [],
    };
  }

//load for the first time, or refresh page
  componentDidMount() {
    this.resetArray();
    STOP = false;
  }

//reset the array with new values, the same functio that is
  resetArray() {
    // console.log("Entered resetArray")
    STOP = true;
    RUNNING = false;
    const array = [];
    for (let i = 0; i < NUMBER_OF_ARRAY_BARS; i++) {
      // push number in the range of 10~500 into the array
      array.push(randomIntFromInterval(10, 500));
    }
    //create new array, replace the previous one
    this.setState({array});
  }

  mergeSort() {
    // if(RUNNING == true)
    //   return;
    // else
    //   RUNNING = true;
    //
    // const animations = getMergeSortAnimations(this.state.array);
    // for (let i = 0; i < animations.length; i++) {
    //   //const arrayBars = document.getElementsByClassName('array-bar');
    //   const isColorChange = i % 3 !== 2; //either the first pair or the third pair
    //   if (isColorChange) {
    //     const [barOneIdx, barTwoIdx] = animations[i];
    //     const barOneStyle = arrayBars[barOneIdx].style;
    //     const barTwoStyle = arrayBars[barTwoIdx].style;
    //     const color = i % 3 === 0 ? SECONDARY_COLOR : PRIMARY_COLOR;
    //
    //     setTimeout(function(){
    //       barOneStyle.backgroundColor = color;
    //       barTwoStyle.backgroundColor = color;
    //     }, i * ANIMATION_SPEED);
    //   } else {
    //     setTimeout(function(){
    //       const [barOneIdx, newHeight] = animations[i];
    //       const barOneStyle = arrayBars[barOneIdx].style;
    //       barOneStyle.height = `${newHeight}px`;
    //     }, i * ANIMATION_SPEED);
    //
    //     if(STOP == true){
    //       STOP = false;
    //       RUNNING = false;
    //       return;
    //     }
    //   }
    // }
  }

 swap (arr, i, j){
      let tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;

      //let arrayBars = document.getElementsByClassName('array-bar');
      arrayBars[i].style.height = `${arr[i]}px`;
      arrayBars[j].style.height = `${arr[j]}px`;
  }

   async partition (arr, low, high){
      let q = low;
      let i = 0;
      arrayBars[high].style.backgroundColor = 'green';

      for (i = low; i < high; i++) {
        arrayBars[i].style.backgroundColor = SECONDARY_COLOR;
        arrayBars[q].style.backgroundColor = 'blue';
        if (arr[i] < arr[high]) {
            await new Promise(r => setTimeout(r,  ANIMATION_SPEED/10));
            arrayBars[q].style.backgroundColor = PRIMARY_COLOR;
            this.swap(arr, i, q);
            q++;
        }
        await new Promise(r => setTimeout(r,  ANIMATION_SPEED/10));
        arrayBars[i].style.backgroundColor = PRIMARY_COLOR;

        if(STOP == true){
          arrayBars[high].style.backgroundColor = PRIMARY_COLOR;
          arrayBars[i].style.backgroundColor = PRIMARY_COLOR;
          arrayBars[q].style.backgroundColor = PRIMARY_COLOR;
          return;
        }
      }
      arrayBars[high].style.backgroundColor = PRIMARY_COLOR;
      arrayBars[q].style.backgroundColor = PRIMARY_COLOR;

      this.swap(arr, i, q);
      return q;
    }

  async quickSortHelper(arr, low, high){
      if (low < high) {
          let pivot = await this.partition(arr, low, high);

          //const arrayBars = document.getElementsByClassName('array-bar');
          //arrayBars[pivot].style.backgroundColor = SECONDARY_COLOR;
          //await new Promise(r => setTimeout(r,  ANIMATION_SPEED*10));
          //arrayBars[pivot].style.backgroundColor = PRIMARY_COLOR;
          if(STOP == true){
            RUNNING = false;
            return;
          }
          await this.quickSortHelper(arr, low, pivot - 1);
          await this.quickSortHelper(arr, pivot + 1, high);
          return arr;
      }
  }

  async quickSort() {
    if(RUNNING == true)
      return;
    else
      RUNNING = true;

    STOP = false;


    let array = this.state.array;
    let length = array.length;
    await this.quickSortHelper(array, 0, length-1);

    STOP = false;
    RUNNING = false;
  }

  heapSort() {

  }


  async bubbleSort() {
    if(RUNNING == true)
      return;
    else
      RUNNING = true;

    STOP = false;

    let array = this.state.array;
    let sorted = true;

    for(let i = 0; i<array.length - 1; i++){
      for(let j = 0; j<array.length- i-1; j++){
          //let arrayBars = document.getElementsByClassName('array-bar');
          arrayBars[j].style.backgroundColor = SECONDARY_COLOR;
          arrayBars[j+1].style.backgroundColor = SECONDARY_COLOR;
          await new Promise(r => setTimeout(r,  ANIMATION_SPEED));

          if(array[j] > array[j+1]){
            sorted = false;
            let temp = array[j];
            array[j] = array [j+1];
            array[j+1] = temp;
            arrayBars[j].style.height = `${array[j]}px`;
            arrayBars[j+1].style.height = `${array[j+1]}px`;
          }
          arrayBars[j].style.backgroundColor = PRIMARY_COLOR;
          arrayBars[j+1].style.backgroundColor = PRIMARY_COLOR;
          await new Promise(r => setTimeout(r,  ANIMATION_SPEED/5));

        if(STOP == true){
          STOP = false;
          RUNNING = false;
          return;
          }
        }
        if(sorted == true){
          break;
        }
    }
    RUNNING = false;
  }

  stop(){
    // console.log("Entered stop toggle")
    STOP = !STOP;
  }



  render() {
    const {array} = this.state;

    return (
      <div className="array-container">
      <div className = "button-container">
        <Button onClick={() => this.resetArray()} type="button"
        buttonStyle="btn--success--solid"
        buttonSize="btn--medium">Generate New Array</Button>

        <Button onClick={() => this.mergeSort()} type="button"
        buttonStyle="btn--primary--outline"
        buttonSize="btn--medium">Merge Sort</Button>

        <Button onClick={() => this.quickSort()} type="button"
        buttonStyle="btn--primary--outline"
        buttonSize="btn--medium">Quick Sort</Button>

        <Button onClick={() => this.heapSort()} type="button"
        buttonStyle="btn--primary--outline"
        buttonSize="btn--medium">Heap Sort</Button>

        <Button onClick={() => this.bubbleSort()} type="button"
        buttonStyle="btn--primary--outline"
        buttonSize="btn--medium">Bubble Sort</Button>

        <Button onClick={() => this.stop()} type="button"
        buttonStyle="btn--danger--solid"
        buttonSize="btn--medium">Stop</Button>
        </div>
        
        {array.map((value, idx) => (
          <div
            className="array-bar"
            key={idx}
            style={{
              backgroundColor: PRIMARY_COLOR,
              height: `${value}px`,
            }}></div>
        ))}



      </div>
    );
  }
}

// From https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function arraysAreEqual(arrayOne, arrayTwo) {
  if (arrayOne.length !== arrayTwo.length) return false;
  for (let i = 0; i < arrayOne.length; i++) {
    if (arrayOne[i] !== arrayTwo[i]) {
      return false;
    }
  }
  return true;
}
