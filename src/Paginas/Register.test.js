import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'; // Extensiones para aserciones
import axios from 'axios';
import Register from './Register';

// Mockea axios para evitar solicitudes reales
jest.mock('axios');

describe('Register Component', () => {
    test('Renderiza correctamente el formulario', () => {
        render(<Register />);
        
        // Verifica que los campos estén en el DOM
        expect(screen.getByPlaceholderText('Ingresa tu nombre')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Ingresa tu email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Ingresa tu contraseña')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Repite tu contraseña')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Ingresa tu número móvil')).toBeInTheDocument();
    });

    test('Muestra errores de validación al enviar el formulario vacío', async () => {
        render(<Register />);

        // Simula clic en el botón "Crear Usuario"
        fireEvent.click(screen.getByRole('button',{name: 'Crear Usuario'}));

        // Verifica que los mensajes de error se muestren
        expect(await screen.findByText('El nombre es obligatorio')).toBeInTheDocument();
        expect(screen.getByText('El email es obligatorio')).toBeInTheDocument();
        expect(screen.getByText('La contraseña es obligatoria')).toBeInTheDocument();
        expect(screen.getByText('El número de teléfono es obligatorio')).toBeInTheDocument();
    });

    test('Envía los datos correctamente cuando el formulario es válido', async () => {
        // Mockea la respuesta del servidor
        axios.post.mockResolvedValueOnce({ data: { message: 'Usuario creado correctamente' } });

        render(<Register />);

        // Simula la entrada de datos válidos
        fireEvent.change(screen.getByPlaceholderText('Ingresa tu nombre'), { target: { value: 'Juan' } });
        fireEvent.change(screen.getByPlaceholderText('Ingresa tu email'), { target: { value: 'juan@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Ingresa tu contraseña'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByPlaceholderText('Repite tu contraseña'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByPlaceholderText('Ingresa tu número móvil'), { target: { value: '1234567890' } });

        // Simula el envío del formulario        ç
        fireEvent.click(screen.getByRole('button',{name: 'Crear Usuario'}));

        // Verifica que se muestre el mensaje de éxito
        expect(await screen.findByText('Usuario creado correctamente')).toBeInTheDocument();

        // Verifica que se haya llamado a la API con los datos correctos
        expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/users/register', {
            username: 'Juan',
            password: 'password123',
            email: 'juan@example.com',
            phone_number: '1234567890',
        });
    });

    test('Muestra error del servidor al fallar el registro', async () => {
        // Mockea un error del servidor
        axios.post.mockRejectedValueOnce({
            response: { data: { error: 'El email ya está registrado' } },
        });

        render(<Register />);

        // Simula la entrada de datos válidos
        fireEvent.change(screen.getByPlaceholderText('Ingresa tu nombre'), { target: { value: 'Juan' } });
        fireEvent.change(screen.getByPlaceholderText('Ingresa tu email'), { target: { value: 'juan@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Ingresa tu contraseña'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByPlaceholderText('Repite tu contraseña'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByPlaceholderText('Ingresa tu número móvil'), { target: { value: '1234567890' } });

        // Simula el envío del formulario
        fireEvent.click(screen.getByRole('button',{name: 'Crear Usuario'}));


        // Verifica que el error del servidor se muestre
        expect(await screen.findByText('El email ya está registrado')).toBeInTheDocument();
    });
});