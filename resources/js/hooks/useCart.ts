import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import type { Tire, CartItem } from '@/types';

interface CartState {
    items: CartItem[];
    total: number;
    itemCount: number;
}

const CART_STORAGE_KEY = 'webshop-cart';

export function useCart() {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        try {
            const savedCart = localStorage.getItem(CART_STORAGE_KEY);
            if (savedCart) {
                const parsedCart = JSON.parse(savedCart);
                // Convert date strings back to Date objects
                const cartWithDates = parsedCart.map((item: any) => ({
                    ...item,
                    addedAt: new Date(item.addedAt)
                }));
                setCart(cartWithDates);
                console.log('Cart loaded from localStorage:', cartWithDates);
            }
        } catch (error) {
            console.error('Error loading cart from localStorage:', error);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    // Save cart to localStorage whenever cart changes (but only after initial load)
    useEffect(() => {
        if (isLoaded) {
            try {
                localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
                console.log('Cart saved to localStorage:', cart);
            } catch (error) {
                console.error('Error saving cart to localStorage:', error);
            }
        }
    }, [cart, isLoaded]);

    // Add item to cart
    const addToCart = (tire: Tire, quantity: number = 1) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.tire.id === tire.id);

            if (existingItem) {
                // Update quantity if item already exists
                const updatedCart = prevCart.map(item =>
                    item.tire.id === tire.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
                console.log('Updated existing item in cart:', updatedCart);

                // Show toast for quantity update
                toast.success(
                    `Povećana količina: ${tire.naziv || tire.sifra} (${existingItem.quantity + quantity} kom)`,
                    {
                        description: 'Proizvod je već u korpi, količina je povećana',
                    }
                );

                return updatedCart;
            } else {
                // Add new item
                const newItem: CartItem = {
                    id: `${tire.id}-${Date.now()}`,
                    tire,
                    quantity,
                    addedAt: new Date()
                };
                const updatedCart = [...prevCart, newItem];
                console.log('Added new item to cart:', updatedCart);

                // Show toast for new item
                toast.success(
                    `Dodano u korpu: ${tire.naziv || tire.sifra}`,
                    {
                        description: `Količina: ${quantity} kom`,
                    }
                );

                return updatedCart;
            }
        });
    };

    // Remove item from cart
    const removeFromCart = (itemId: string) => {
        setCart(prevCart => {
            const updatedCart = prevCart.filter(item => item.id !== itemId);
            console.log('Removed item from cart:', updatedCart);
            return updatedCart;
        });
    };

    // Update item quantity
    const updateQuantity = (itemId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(itemId);
            return;
        }

        setCart(prevCart => {
            const updatedCart = prevCart.map(item =>
                item.id === itemId
                    ? { ...item, quantity }
                    : item
            );
            console.log('Updated quantity in cart:', updatedCart);
            return updatedCart;
        });
    };

    // Check if tire is in cart
    const isInCart = (tireId: number): boolean => {
        return cart.some(item => item.tire.id === tireId);
    };

    // Get item quantity for a specific tire
    const getItemQuantity = (tireId: number): number => {
        const item = cart.find(item => item.tire.id === tireId);
        return item ? item.quantity : 0;
    };

    // Clear entire cart
    const clearCart = () => {
        setCart([]);
        console.log('Cart cleared');
    };

    // Calculate totals
    const itemCount = cart.length; // Count of unique item types, not total quantity
    const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0); // Total quantity if needed
    const total = cart.reduce((sum, item) => sum + (item.quantity * (item.tire.quantity || 0)), 0);

    return {
        cart,
        itemCount,
        totalQuantity,
        total,
        addToCart,
        removeFromCart,
        updateQuantity,
        isInCart,
        getItemQuantity,
        clearCart,
        isLoaded // Export this so components can know when cart is ready
    };
}
