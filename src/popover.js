import './styles.css';

let currentPopover = null;

export function initPopovers() {
    const button = document.querySelector('.popover-btn');
    
    if (button) {
        button.addEventListener('click', function(event) {
            event.stopPropagation();
            
            const title = this.dataset.title;
            const content = this.dataset.content;
            
            // Если есть открытый popover с этой же кнопки - закрываем
            if (currentPopover && currentPopover.referenceButton === this) {
                closePopover();
                return;
            }
            
            // Если есть другой popover - закрываем
            if (currentPopover) {
                closePopover();
            }
            
            // Показываем новый popover
            showPopover(this, title, content);
        });
    }

    // Закрытие при клике вне popover
    document.addEventListener('click', function(event) {
        if (!currentPopover) return;
        
        const isPopoverClick = currentPopover.contains(event.target);
        const isButtonClick = event.target.classList.contains('popover-btn');
        
        if (!isPopoverClick && !isButtonClick) {
            closePopover();
        }
    });

    // Закрытие при нажатии ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && currentPopover) {
            closePopover();
        }
    });

    // Закрытие при скролле
    window.addEventListener('scroll', function() {
        if (currentPopover) {
            closePopover();
        }
    }, true);
}

export function showPopover(button, title, content) {
    const popover = document.createElement('div');
    popover.className = 'popover';
    popover.setAttribute('role', 'tooltip');
    popover.referenceButton = button; // сохраняем ссылку на кнопку
    
    // Добавляем стрелку
    const arrow = document.createElement('div');
    arrow.className = 'popover-arrow';
    
    const header = document.createElement('div');
    header.className = 'popover-header';
    header.textContent = title;
    
    const body = document.createElement('div');
    body.className = 'popover-body';
    body.textContent = content;
    
    popover.append(arrow, header, body);
    document.body.append(popover);
    
    positionPopover(popover, button);
    currentPopover = popover;
}

function positionPopover(popover, button) {
    const buttonRect = button.getBoundingClientRect();
    const popoverRect = popover.getBoundingClientRect();
    
    // Рассчитываем позицию сверху от кнопки
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
    
    // Позиционируем сверху
    const top = buttonRect.top + scrollTop - popoverRect.height - 8; // 8px отступ
    
    // Центрируем по горизонтали
    const left = buttonRect.left + scrollLeft + (buttonRect.width / 2) - (popoverRect.width / 2);
    
    // Проверяем, не выходит ли за левый край экрана
    const finalLeft = Math.max(8, Math.min(left, window.innerWidth - popoverRect.width - 8));
    
    popover.style.top = `${top}px`;
    popover.style.left = `${finalLeft}px`;
    
    // Добавляем атрибут для позиционирования стрелки
    popover.setAttribute('data-popper-placement', 'top');
}

export function closePopover() {
    if (currentPopover) {
        currentPopover.remove();
        currentPopover = null;
    }
}

// Инициализируем при загрузке DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPopovers);
} else {
    initPopovers();
}