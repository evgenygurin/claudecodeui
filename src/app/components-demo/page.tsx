// components-demo/page.tsx
// Демонстрационная страница для тестирования интегрированных компонентов

"use client";

import React, { useState } from 'react';
import { Button, IconButton, LoadingButton } from '@/components/integrated/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, QuickCard } from '@/components/integrated/ui/Card';
import { Toast, ToastProvider, useToast } from '@/components/integrated/ui/Toast';
import { Play, Download, Heart, Star, Settings, User, Mail, Phone } from 'lucide-react';

export default function ComponentsDemoPage() {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Integrated Components Demo
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Демонстрация современных компонентов, интегрированных из v0.app с улучшенной функциональностью
            </p>
          </div>

          {/* Button Components */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold">Button Components</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Buttons</CardTitle>
                  <CardDescription>Различные варианты кнопок</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Button variant="default">Default</Button>
                    <Button variant="destructive">Destructive</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="link">Link</Button>
                    <Button variant="gradient">Gradient</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Button Sizes</CardTitle>
                  <CardDescription>Различные размеры кнопок</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Button size="sm">Small</Button>
                    <Button size="default">Default</Button>
                    <Button size="lg">Large</Button>
                    <Button size="xl">Extra Large</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Button States</CardTitle>
                  <CardDescription>Состояния кнопок</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Button leftIcon={<Play className="h-4 w-4" />}>With Icon</Button>
                    <Button rightIcon={<Download className="h-4 w-4" />}>Download</Button>
                    <Button disabled>Disabled</Button>
                    <LoadingButton loading>Loading</LoadingButton>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Card Components */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold">Card Components</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card variant="default">
                <CardHeader>
                  <CardTitle>Default Card</CardTitle>
                  <CardDescription>Стандартная карточка с границей</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Это содержимое карточки с базовым стилем.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button size="sm">Action</Button>
                </CardFooter>
              </Card>

              <Card variant="elevated" hover>
                <CardHeader>
                  <CardTitle>Elevated Card</CardTitle>
                  <CardDescription>Карточка с тенью и hover эффектом</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Наведите курсор для эффекта hover.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm">Learn More</Button>
                </CardFooter>
              </Card>

              <Card variant="glass">
                <CardHeader>
                  <CardTitle>Glass Card</CardTitle>
                  <CardDescription>Карточка с эффектом стекла</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Современный дизайн с размытием фона.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="gradient" size="sm">Explore</Button>
                </CardFooter>
              </Card>

              <QuickCard
                title="Quick Card"
                description="Быстрое создание карточки"
                footer={<Button size="sm">Quick Action</Button>}
              >
                <p className="text-sm text-muted-foreground">
                  Компонент QuickCard позволяет быстро создавать карточки с заголовком, описанием и футером.
                </p>
              </QuickCard>

              <Card variant="gradient" interactive>
                <CardHeader>
                  <CardTitle>Interactive Card</CardTitle>
                  <CardDescription>Кликабельная карточка</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Нажмите на карточку для взаимодействия.
                  </p>
                </CardContent>
              </Card>

              <Card variant="outlined" padding="lg">
                <CardHeader>
                  <CardTitle>Custom Padding</CardTitle>
                  <CardDescription>Карточка с увеличенным отступом</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Эта карточка имеет увеличенный внутренний отступ.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Toast Demo */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold">Toast Notifications</h2>
            <ToastDemo />
          </section>

          {/* Component Showcase */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold">Component Showcase</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card variant="elevated" padding="lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    User Profile
                  </CardTitle>
                  <CardDescription>Пример использования компонентов в реальном интерфейсе</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      JD
                    </div>
                    <div>
                      <h3 className="font-semibold">John Doe</h3>
                      <p className="text-sm text-muted-foreground">Software Developer</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" leftIcon={<Mail className="h-4 w-4" />}>
                      Message
                    </Button>
                    <Button size="sm" variant="outline" leftIcon={<Phone className="h-4 w-4" />}>
                      Call
                    </Button>
                    <IconButton variant="ghost">
                      <Heart className="h-4 w-4" />
                    </IconButton>
                  </div>
                </CardContent>
              </Card>

              <Card variant="glass" padding="lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Settings Panel
                  </CardTitle>
                  <CardDescription>Панель настроек с различными элементами</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Notifications</span>
                      <Button size="sm" variant="outline">Toggle</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Dark Mode</span>
                      <Button size="sm" variant="outline">Toggle</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Auto-save</span>
                      <Button size="sm" variant="outline">Toggle</Button>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex gap-2">
                      <Button size="sm" variant="gradient" fullWidth>
                        Save Changes
                      </Button>
                      <Button size="sm" variant="outline">
                        Reset
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Footer */}
          <footer className="text-center py-8 border-t">
            <p className="text-sm text-muted-foreground">
              Демонстрация интегрированных компонентов из v0.app • Claude Code UI
            </p>
          </footer>
        </div>
      </div>
    </ToastProvider>
  );
}

// Компонент для демонстрации Toast уведомлений
function ToastDemo() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  const showToast = (variant: "default" | "success" | "destructive" | "warning" | "info" | "loading") => {
    const toastConfig = {
      default: {
        title: "Default Toast",
        description: "Это стандартное уведомление",
        variant: "default" as const
      },
      success: {
        title: "Success!",
        description: "Операция выполнена успешно",
        variant: "success" as const
      },
      destructive: {
        title: "Error",
        description: "Произошла ошибка при выполнении операции",
        variant: "destructive" as const
      },
      warning: {
        title: "Warning",
        description: "Внимание! Проверьте введенные данные",
        variant: "warning" as const
      },
      info: {
        title: "Information",
        description: "Полезная информация для пользователя",
        variant: "info" as const
      },
      loading: {
        title: "Loading",
        description: "Загрузка данных...",
        variant: "loading" as const,
        duration: 0 // Не исчезает автоматически
      }
    };

    addToast(toastConfig[variant]);
  };

  const showLoadingToast = () => {
    setLoading(true);
    showToast("loading");
    
    // Симулируем загрузку
    setTimeout(() => {
      setLoading(false);
      showToast("success");
    }, 3000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Toast Notifications</CardTitle>
        <CardDescription>Различные типы уведомлений с анимациями</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => showToast("default")} variant="outline">
            Default Toast
          </Button>
          <Button onClick={() => showToast("success")} variant="outline">
            Success Toast
          </Button>
          <Button onClick={() => showToast("destructive")} variant="outline">
            Error Toast
          </Button>
          <Button onClick={() => showToast("warning")} variant="outline">
            Warning Toast
          </Button>
          <Button onClick={() => showToast("info")} variant="outline">
            Info Toast
          </Button>
          <LoadingButton 
            onClick={showLoadingToast} 
            loading={loading}
            variant="gradient"
          >
            Loading Toast
          </LoadingButton>
        </div>
      </CardContent>
    </Card>
  );
}
