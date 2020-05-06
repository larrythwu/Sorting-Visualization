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

async update_arrayBars(arr){
  for(let i =0; i<arrayBars.length; i++){
    arrayBars[i].style.height = `${arr[i]}px`;
    if(STOP == false)
    await new Promise(r => setTimeout(r,  ANIMATION_SPEED/5));
  }

}

async merge_sort(arr) {
    let sorted = arr.slice();
    let n = sorted.length;
    let buffer = new Array(n);

    for (let size = 1; size < n; size *= 2) {
      for (let leftStart = 0; leftStart < n; leftStart += 2*size) {
        let left = leftStart,
            right = Math.min(left + size, n),
            leftLimit = right,
            rightLimit = Math.min(right + size, n),
            i = left;
        while (left < leftLimit && right < rightLimit) {
          arrayBars[left].style.backgroundColor = SECONDARY_COLOR;
          arrayBars[right].style.backgroundColor = SECONDARY_COLOR;
          await new Promise(r => setTimeout(r,  ANIMATION_SPEED/5));
          arrayBars[left].style.backgroundColor = PRIMARY_COLOR;
          arrayBars[right].style.backgroundColor = PRIMARY_COLOR;

          if(STOP == true){
            await this.update_arrayBars(sorted);
            STOP = false;
            return sorted;
          }

          if (sorted[left] <= sorted[right]) {
            buffer[i++] = sorted[left++];
          } else {
            buffer[i++] = sorted[right++];
          }
        }

        while (left < leftLimit) {
          arrayBars[left].style.backgroundColor = SECONDARY_COLOR;
          await new Promise(r => setTimeout(r,  ANIMATION_SPEED/2));
          arrayBars[left].style.backgroundColor = PRIMARY_COLOR;
          buffer[i++] = sorted[left++];
        }
        while (right < rightLimit) {
          arrayBars[right].style.backgroundColor = SECONDARY_COLOR;
          await new Promise(r => setTimeout(r,  ANIMATION_SPEED/2));
          arrayBars[right].style.backgroundColor = PRIMARY_COLOR;
          buffer[i++] = sorted[right++];
        }
      }
      await this.update_arrayBars(buffer);

      let temp = sorted;
          sorted = buffer;
          buffer = temp;
    }
    return sorted;
  }

  async mergeSort() {
    if(RUNNING == true)
      return;
    else
      RUNNING = true;
    STOP = false;

    this.state.array = await this.merge_sort(this.state.array);
    RUNNING = false;
  }

 swap (arr, i, j){
      let tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
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
          // RUNNING = false;
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

async heapify(heap, i, max) {
    var index, leftChild, righChild;

    while(i < max) {
      index = i;

      leftChild = 2*i + 1;
      righChild = leftChild + 1;

      if (leftChild < max && heap[leftChild] > heap[index]) {
        index = leftChild;
      }

      if (righChild < max && heap[righChild] > heap[index]) {
        index = righChild;
      }

      if (index == i) {
        return;
      }

      arrayBars[i].style.backgroundColor = SECONDARY_COLOR;
      arrayBars[index].style.backgroundColor = SECONDARY_COLOR;
      await new Promise(r => setTimeout(r,  ANIMATION_SPEED/2));
      arrayBars[i].style.backgroundColor = PRIMARY_COLOR;
      arrayBars[index].style.backgroundColor = PRIMARY_COLOR;
      this.swap(heap,i, index);

      i = index;

      if(STOP == true)
        return;

  }
}

async buildMaxHeap(array) {
    var i;
    i = array.length / 2 - 1;
    i = Math.floor(i);

    // Build a max heap out of
    // all array elements passed in.
    while (i >= 0) {
      await this.heapify(array, i, array.length);
      i -= 1;
      if(STOP == true)
        return;
    }
}

async heapSort() {
    if(RUNNING == true)
      return;
    else
      RUNNING = true;
    STOP = false;


    let array = this.state.array;
    // Build our max heap.
    await this.buildMaxHeap(array);

    // Find last element.
    let lastElement = array.length - 1;

    // Continue heap sorting until we have
    // just one element left in the array.
    while(lastElement > 0) {
      this.swap(array, 0, lastElement);

      await this.heapify(array, 0, lastElement);

      lastElement -= 1

      if(STOP == true)
        break;
    }

    STOP = false;
    RUNNING = false;
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
          await new Promise(r => setTimeout(r,  ANIMATION_SPEED/30));

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
          await new Promise(r => setTimeout(r,  ANIMATION_SPEED/30));

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
