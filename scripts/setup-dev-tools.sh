#!/bin/bash

# Setup Advanced Development Tools
# Установка и настройка продвинутых инструментов разработки

echo "🚀 Настройка продвинутых инструментов разработки..."

# Проверяем наличие Homebrew
if ! command -v brew &> /dev/null; then
    echo "❌ Homebrew не найден. Устанавливаем..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi

# Устанавливаем fd (быстрый поиск файлов)
echo "📁 Устанавливаем fd..."
brew install fd

# Устанавливаем ripgrep (rg) - быстрый поиск по содержимому
echo "🔍 Устанавливаем ripgrep..."
brew install ripgrep

# Устанавливаем ast-grep для анализа AST
echo "🌳 Устанавливаем ast-grep..."
brew install ast-grep

# Устанавливаем jq для работы с JSON
echo "📄 Устанавливаем jq..."
brew install jq

# Устанавливаем yq для работы с YAML
echo "📋 Устанавливаем yq..."
brew install yq

# Создаем алиасы для удобства
echo "⚙️ Создаем алиасы..."

# Добавляем алиасы в .zshrc
cat >> ~/.zshrc << 'EOF'

# Advanced Development Tools Aliases
alias ff='fd --type f'  # Find files
alias fd='fd --type d'  # Find directories
alias fg='rg --type js --type ts --type tsx --type jsx'  # Grep in code files
alias fj='jq'  # JSON processor
alias fy='yq'  # YAML processor

# Project-specific aliases
alias pfind='fd --type f --extension tsx --extension ts --extension js --extension jsx'
alias psearch='rg --type js --type ts --type tsx --type jsx'
alias pjson='jq'
alias pyaml='yq'

EOF

echo "✅ Все инструменты установлены и настроены!"
echo "🔄 Перезагрузите терминал или выполните: source ~/.zshrc"
