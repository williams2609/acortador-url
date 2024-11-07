import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

// Definir los niveles de membresía
const MEMBERSHIP_LEVELS = {
    basic: { name: "basico", price: "0.00" },
    platino: { name: "platino", price: "3.99" },
    diamante: { name: "diamante", price: "5.99" }
};

const PayPalComponent = ({ membershipType, onUpgrade }) => {
    const membership = MEMBERSHIP_LEVELS[membershipType];
    console.log(membership.price)
    return (
        <PayPalScriptProvider options={{ "client-id": "AcluDu8z_YEba59Bl-Nc3CvgGf0UlP0gbM_rkQb0s-Q8QP2c9HIvBCaM84hFEiS0gcY2k5ovBO6yAP8u" }}>
            <PayPalButtons
                createOrder={(data, actions) => {
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                value: membership.price.toString()  // Monto basado en el nivel de membresía
                            }
                        }]
                    });
                }}
                onApprove={(data, actions) => {
                    return actions.order.capture().then((details) => {
                        alert(`Transacción completada por: ${details.payer.name.given_name}`);
                        
                        // Llama a la función onUpgrade para actualizar la membresía del usuario
                        onUpgrade(membershipType);
                        console.log(`el usuario a sido mejorado a ${membershipType}`)
                    });
                }}
                onError={(err) => {
                    console.error("Error en la transacción:", err);
                    alert("Ocurrió un error en el proceso de pago. Por favor, intenta de nuevo.");
                }}
            />
        </PayPalScriptProvider>
    );
};

export default PayPalComponent;