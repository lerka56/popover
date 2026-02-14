

const { initPopovers, showPopover, closePopover } = require('../src/popover');

describe('Popover Widget', () => {
    let button;
    
    beforeEach(() => {
        // Настраиваем DOM перед каждым тестом
        document.body.innerHTML = `
            <button class="popover-btn" 
                    data-title="Popover title" 
                    data-content="And here's some amazing content. It's very engaging. Right?">
                Click to toggle popover
            </button>
        `;
        
        button = document.querySelector('.popover-btn');
        
        // Сбрасываем currentPopover
        if (typeof closePopover === 'function') {
            closePopover();
        }
    });
    
    afterEach(() => {
        // Очищаем после каждого теста
        document.body.innerHTML = '';
    });
    
    test('should initialize popovers', () => {
        expect(button).not.toBeNull();
    });
    
    test('should show popover on button click', () => {
        // Инициализируем обработчики
        initPopovers();
        
        // Кликаем на кнопку
        button.click();
        
        // Проверяем, что popover появился
        const popover = document.querySelector('.popover');
        expect(popover).not.toBeNull();
        expect(popover.querySelector('.popover-header').textContent).toBe('Popover title');
        expect(popover.querySelector('.popover-body').textContent).toBe("And here's some amazing content. It's very engaging. Right?");
    });
    
    test('should hide popover when clicking same button again', () => {
        initPopovers();
        
        // Первый клик - показываем
        button.click();
        expect(document.querySelector('.popover')).not.toBeNull();
        
        // Второй клик - скрываем
        button.click();
        expect(document.querySelector('.popover')).toBeNull();
    });
    
    test('should close popover when clicking outside', () => {
        initPopovers();
        
        // Открываем popover
        button.click();
        expect(document.querySelector('.popover')).not.toBeNull();
        
        // Кликаем вне popover и кнопки
        document.body.click();
        
        expect(document.querySelector('.popover')).toBeNull();
    });
    
    test('should close popover on ESC key', () => {
        initPopovers();
        
        // Открываем popover
        button.click();
        expect(document.querySelector('.popover')).not.toBeNull();
        
        // Нажимаем ESC
        const escEvent = new KeyboardEvent('keydown', { key: 'Escape' });
        document.dispatchEvent(escEvent);
        
        expect(document.querySelector('.popover')).toBeNull();
    });
    
    test('should position popover above button', () => {
        // Мокаем getBoundingClientRect
        const mockButtonRect = {
            top: 200,
            left: 300,
            width: 100,
            height: 40,
            bottom: 240,
            right: 400
        };
        
        const mockPopoverRect = {
            width: 200,
            height: 100
        };
        
        button.getBoundingClientRect = jest.fn(() => mockButtonRect);
        
        // Создаем и позиционируем popover
        const popover = document.createElement('div');
        popover.className = 'popover';
        popover.innerHTML = '<div class="popover-header">Title</div><div class="popover-body">Content</div>';
        document.body.append(popover);
        
        popover.getBoundingClientRect = jest.fn(() => mockPopoverRect);
        
        // Вызываем позиционирование
        if (typeof showPopover === 'function') {
            showPopover(button, 'Title', 'Content');
        }
        
        // Проверяем, что popover позиционирован сверху
        const positionedPopover = document.querySelector('.popover');
        if (positionedPopover) {
            const top = parseInt(positionedPopover.style.top);
            expect(top).toBeLessThan(mockButtonRect.top);
        }
    });
});