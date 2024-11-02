import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PayPalComponent = () => {
    return (
        <PayPalScriptProvider options={{ "client-id": "AVI3Mr2yXf8zGhf9Ie8EaXZ14WkHEmw47U6h2dTrL3FqYhFWtLYHgQaI0H0tmESwBxjHi_PKemRq06K6" }}>
            <PayPalButtons
                createOrder={(data, actions) => {
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                value: '3.99' 
                            }
                        }]
                    });
                }}
                onApprove={(data, actions) => {
                    return actions.order.capture().then((details) => {
                        alert(`Transacción completada por: ${details.payer.name.given_name}`);
                        
                    });
                }}
                onError={(err) => {
                    console.error("Error en la transacción:", err);
                }}
            />
        </PayPalScriptProvider>
    );
};

export default PayPalComponent;