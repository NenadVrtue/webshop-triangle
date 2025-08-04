import React, { useState, useEffect } from 'react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/useCart";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import type { Tire, CartItem } from '@/types';

interface CartSheetProps {
    children: React.ReactNode;
    cart?: CartItem[];
    itemCount?: number;
    totalQuantity?: number;
    isLoaded?: boolean;
    updateQuantity?: (itemId: string, quantity: number) => void;
    removeFromCart?: (itemId: string) => void;
    clearCart?: () => void;
}

export function CartSheet({
    children,
    cart: propCart,
    itemCount: propItemCount,
    totalQuantity: propTotalQuantity,
    isLoaded: propIsLoaded,
    updateQuantity: propUpdateQuantity,
    removeFromCart: propRemoveFromCart,
    clearCart: propClearCart
}: CartSheetProps) {
    // Use props if provided, otherwise fall back to hook
    const hookData = useCart();

    const cart = propCart ?? hookData.cart;
    const itemCount = propItemCount ?? hookData.itemCount;
    const totalQuantity = propTotalQuantity ?? hookData.totalQuantity;
    const isLoaded = propIsLoaded ?? hookData.isLoaded;

    // Use prop functions if provided, otherwise use hook functions
    const updateQuantity = propUpdateQuantity ?? hookData.updateQuantity;
    const removeFromCart = propRemoveFromCart ?? hookData.removeFromCart;
    const clearCart = propClearCart ?? hookData.clearCart;

    const [editingQuantities, setEditingQuantities] = useState<{ [key: string]: string }>({});

    // Debug cart state in sheet
    useEffect(() => {
        console.log('CartSheet: Cart state changed:', { cart, itemCount, totalQuantity, isLoaded });
        console.log('CartSheet: Using props?', {
            usingPropCart: !!propCart,
            usingPropItemCount: !!propItemCount,
            usingPropActions: !!propUpdateQuantity
        });
    }, [cart, itemCount, totalQuantity, isLoaded, propCart, propItemCount, propUpdateQuantity]);

    const handleQuantityChange = (itemId: string, newQuantity: number) => {
        console.log('CartSheet: handleQuantityChange called:', { itemId, newQuantity });
        if (newQuantity <= 0) {
            console.log('CartSheet: Removing item:', itemId);
            removeFromCart(itemId);
        } else {
            console.log('CartSheet: Updating quantity:', itemId, 'to', newQuantity);
            updateQuantity(itemId, newQuantity);
        }
    };

    const handleQuantityInputChange = (itemId: string, value: string) => {
        setEditingQuantities(prev => ({ ...prev, [itemId]: value }));
    };

    const handleQuantityInputBlur = (itemId: string, value: string) => {
        const numValue = parseInt(value) || 1;
        handleQuantityChange(itemId, numValue);
        setEditingQuantities(prev => {
            const newState = { ...prev };
            delete newState[itemId];
            return newState;
        });
    };

    const handleQuantityInputKeyPress = (itemId: string, value: string, e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            console.log('CartSheet: Enter pressed on input:', { itemId, value });
            handleQuantityInputBlur(itemId, value);
        }
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5" />
                        Korpa ({itemCount} tipova)
                    </SheetTitle>
                    <SheetDescription>
                        Pregled stavki u vašoj korpi ({totalQuantity} ukupno stavki)
                    </SheetDescription>

                    {/* Debug Info - Remove this in production */}
                    <div className="bg-gray-100 p-2 rounded text-xs">
                        <strong>Debug:</strong> isLoaded: {isLoaded.toString()}, cart.length: {cart.length}, itemCount: {itemCount}
                    </div>
                </SheetHeader>

                <div className="flex flex-col h-full">
                    {!isLoaded ? (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center">
                                <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-4 animate-pulse" />
                                <p className="text-gray-500">Učitavanje korpe...</p>
                            </div>
                        </div>
                    ) : cart.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center">
                                <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                <p className="text-gray-500">Vaša korpa je prazna</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Cart Items */}
                            <div className="flex-1 overflow-y-auto py-4">
                                <div className="space-y-4">
                                    {cart.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center gap-4 p-4 border rounded-lg"
                                        >
                                            <div className="flex-1">
                                                <h4 className="font-medium">{item.tire.naziv}</h4>
                                                <p className="text-sm text-gray-600">
                                                    Šifra: {item.tire.sifra}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {item.tire.dimenzije}
                                                </p>
                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleQuantityChange(item.id, item.quantity - 1)
                                                    }
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </Button>

                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={editingQuantities[item.id] ?? item.quantity}
                                                    onChange={(e) => handleQuantityInputChange(item.id, e.target.value)}
                                                    onBlur={(e) => handleQuantityInputBlur(item.id, e.target.value)}
                                                    onKeyDown={(e) => handleQuantityInputKeyPress(item.id, e.currentTarget.value, e)}
                                                    className="w-16 h-8 text-center"
                                                />

                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleQuantityChange(item.id, item.quantity + 1)
                                                    }
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            {/* Remove Button */}
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => removeFromCart(item.id)}
                                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Cart Footer */}
                            <div className="border-t pt-4 space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">Tipova stavki:</span>
                                        <span className="font-bold">{itemCount}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">Ukupno stavki:</span>
                                        <span className="font-bold">{totalQuantity}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={clearCart}
                                        className="flex-1"
                                    >
                                        Očisti korpu
                                    </Button>
                                    <Button
                                        className="flex-1"
                                        onClick={() => window.location.href = '/checkout'}
                                    >
                                        Nastavi na checkout
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
