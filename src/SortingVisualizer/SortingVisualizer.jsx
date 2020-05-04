import React from 'react';
import {getMergeSortAnimations} from '../sortingAlgorithms/sortingAlgorithms.js';
import './sortingVisualizer.css';


// Change this value for the number of bars (value) in the array.
const NUMBER_OF_ARRAY_BARS = 100;

// This is the main color of the array bars.
const PRIMARY_COLOR = 'turquoise';

// This is the color of array bars that are being compared throughout the animations.
const SECONDARY_COLOR = 'red';

//animation speed
let ANIMATION_SPEED = 30;

let STOP = false;
let RUNNING = false;
const arrayBars = document.getElementsByClassName('array-bar');

//
// function partition(arr,  low,  high){
//           let pivot = arr[high];
//
//           // index of smaller element
//           let i = (low - 1);
//           for (let j = low; j <= high - 1; j++) {
//               // If current element is smaller than or
//               // equal to pivot
//               if (arr[j] <= pivot) {
//                   i++;
//
//                   // swap arr[i] and arr[j]
//                   let temp = arr[i];
//                   arr[i] = arr[j];
//                   arr[j] = temp;
//               }
//           }
//
//           // swap arr[i+1] and arr[high] (or pivot)
//           let temp = arr[i + 1];
//           arr[i + 1] = arr[high];
//           arr[high] = temp;
//
//           return i + 1;
//   }
//
//   /* A[] --> Array to be sorted,
//   l  --> Starting index,
//   h  --> Ending index */
//   function quickSortIterative(arr,  l,  h){
//           // Create an auxiliary stack
//           let stack = new Array(h - l + 1);
//
//           // initialize top of stack
//           let top = -1;
//
//           // push initial values of l and h to stack
//           stack[++top] = l;
//           stack[++top] = h;
//
//           // Keep popping from stack while is not empty
//           while (top >= 0) {
//               // Pop h and l
//               h = stack[top--];
//               l = stack[top--];
//
//               // Set pivot element at its correct position
//               // in sorted array
//               let p = partition(arr, l, h);
//
//               // If there are elements on left side of pivot,
//               // then push left side to stack
//               if (p - 1 > l) {
//                   stack[++top] = l;
//                   stack[++top] = p - 1;
//               }
//
//               // If there are elements on right side of pivot,
//               // then push right side to stack
//               if (p + 1 < h) {
//                   stack[++top] = p + 1;
//                   stack[++top] = h;
//               }
//           }
//   }

export default class SortingVisualizer extends React.Component {
  constructor(props) {
    super(props);

//storage, so is global variable allowed?
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
    if(RUNNING == true)
      return;
    else
      RUNNING = true;

    const animations = getMergeSortAnimations(this.state.array);
    for (let i = 0; i < animations.length; i++) {
      //const arrayBars = document.getElementsByClassName('array-bar');
      const isColorChange = i % 3 !== 2; //either the first pair or the third pair
      if (isColorChange) {
        const [barOneIdx, barTwoIdx] = animations[i];
        const barOneStyle = arrayBars[barOneIdx].style;
        const barTwoStyle = arrayBars[barTwoIdx].style;
        const color = i % 3 === 0 ? SECONDARY_COLOR : PRIMARY_COLOR;

        setTimeout(function(){
          barOneStyle.backgroundColor = color;
          barTwoStyle.backgroundColor = color;
        }, i * ANIMATION_SPEED);
      } else {
        setTimeout(function(){
          const [barOneIdx, newHeight] = animations[i];
          const barOneStyle = arrayBars[barOneIdx].style;
          barOneStyle.height = `${newHeight}px`;
        }, i * ANIMATION_SPEED);

        if(STOP == true){
          STOP = false;
          RUNNING = false;
          return;
        }
      }
    }
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
    // We leave it as an exercise to the viewer of this code to implement this method.
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
        {array.map((value, idx) => (
          <div
            className="array-bar"
            key={idx}
            style={{
              backgroundColor: PRIMARY_COLOR,
              height: `${value}px`,
            }}></div>
        ))}

        <button onClick={() => this.resetArray()}>Generate New Array</button>
        <button onClick={() => this.mergeSort()}>Merge Sort</button>
        <button onClick={() => this.quickSort()}>Quick Sort</button>
        <button onClick={() => this.heapSort()}>Heap Sort</button>
        <button onClick={() => this.bubbleSort()}>Bubble Sort</button>
        <button onClick={() => this.stop()}>Stop</button>

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
