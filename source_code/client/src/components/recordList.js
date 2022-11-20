import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/style.css";
import Covid from "../covid19/covid";
import Card from "./card";

export default function RecordList() {
  
  const [ firstNumber, setFirstNumber ] = useState(0);
  const [ secondNumber, setSecondNumber ] = useState(0);
  const [ result, setResult ] = useState(0);

  const [textentered, setTextEntered] = useState();
    const Text = (e) => {
        setTextEntered(e.target.value)
    }

  const sum_of_2_numbers = () => {
      fetch(`http://localhost:4000/sum_2_numbers?firstNumber=${firstNumber}&secondNumber=${secondNumber}`)
          .then(response => response.json())
          .then((data) => {
            setResult(data.result)
          } )
          .catch(err => console.error(err));
  }

  return (
    <div>
      <Card />
      <div className="container mt-5">
      <h2 className="mb-5">Sum of two numbers</h2>
              <div className="row">
                <div className="col">
                <div className="sum_of_two_number">
              <div className="form-group">
                <label htmlFor="number1">Enter First number</label>
                <input type="number" value={firstNumber} onChange={(e) => setFirstNumber(e.target.value)} className="form-control" id="number1" placeholder="First number" />
              </div>
              <div className="form-group">
                <label htmlFor="number2">Enter Second number</label>
                <input type="number" value={secondNumber} onChange={(e) => setSecondNumber(e.target.value)} className="form-control" id="number2" placeholder="Second number" />
              </div>
              <button type="button" onClick={() => sum_of_2_numbers()} className="btn btn-primary">Total</button>
              <div className="rmt-3 mb-3">
                <span>Sum of numbers:{result}</span>
              </div>
            </div>
                </div>
              </div>
            </div>
            <div className="container mt-5">
            <div className="row">
                <div className="col">
                    <div className="mb-3">
                        <label htmlFor="Textarea" className="form-label">Enter the text you want to display</label>
                        <textarea onChange={(e) => Text(e)} className="form-control" id="Textarea" rows="3"></textarea>
                    </div>
                    <div className="textentered">
                        {textentered}
                    </div>
                </div>
            </div>
        </div>
      <Covid />
    </div>
  );
}
