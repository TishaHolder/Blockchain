import React, {useState, useEffect} from "react";
import axios from "axios";
import 'semantic-ui-css/semantic.css';
import 'semantic-ui-css/semantic.min.css'; 
import { Grid, Form, Input, TextArea, Button, Select } from "semantic-ui-react";

function Wallet(props){

    const [userId, setUserId] = useState("");
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    let filteredTransactions = [];
    let tempBalance = 0;
   

    //use when getting blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the 
    //requested resource.
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const url = "https://lambda-coin-test-1.herokuapp.com/api/full_chain";
   
    const changeHandler = (e) => {
        e.preventDefault();
        setUserId(
            e.target.value
        )

        console.log("userId", e.target.value);

    }

        
    const submitHandler = (e) => {
        e.preventDefault();

        axios.get(proxyurl + url)
        .then(res => {
           console.log(res.data.chain);
           let filteredTransactions = res.data.chain.filter(transaction => {
                //there is a bug here. will not retrieve senders or recipeients other than "0"
                return transaction.transactions.sender === "0" || transaction.transactions.recipient === "0"
            })

            filteredTransactions.map( transaction => {                
               
                /*need to change "0" to userId */
                return transaction.transactions.sender === "0" ? 
                tempBalance -= transaction.transactions.amount
                :
                /*need to change "0" to userId */
                transaction.transactions.recipient === "0" ? 
                tempBalance += transaction.transactions.amount                       
                : 
                null
                
                
            })                       

            setTransactions(filteredTransactions);
            setBalance(tempBalance);
            console.log("filtered transactions in submit handler", filteredTransactions);
            
        })           
        .catch( err => {
            console.log("err", err)
        })

    }    

    return(

        <div>
            
           <input 
                type = "text" 
                name = "userId" 
                value = {userId} 
                placeholder = "Please enter your user id"
                onChange = {changeHandler} />

            <button onClick = {submitHandler}> Get Transactions </button>

            <p>
                Total Balance: {balance}
            </p>         
         

            {transactions.length > 0 ? 

                <div className = "transactions-all"> 
            
                    {transactions.map( transaction => {                  
                    
                        return <div className = "transactions-individual">
                        <p>Index: {transaction.index}</p>
                        <p>Proof: {transaction.proof}</p>
                        <p>Amount: {transaction.transactions.amount}</p>
                        <p>Sender: {transaction.transactions.sender}</p>
                        <p>Recipient: {transaction.transactions.recipient}</p>
                        </div>                  
                        
                    }) }

                </div>              
        
            :

            null}                       
            
        </div>


    
    

    );

}

export default Wallet;

