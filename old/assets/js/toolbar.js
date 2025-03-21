/**
 * toolbar.js - Toolbar component for Pyastrator
 * Handles creation and management of the application toolbar
 */

class Toolbar {
    /**
     * Create a new Toolbar instance
     * @param {string} containerId - ID of the container element
     * @param {Object} options - Configuration options
     */
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            throw new Error(`Container with ID "${containerId}" not found`);
        }
        
        this.options = Object.assign({
            orientation: 'horizontal',
            theme: 'light',
            buttonSize: 'medium',
        }, options);
        
        this.tools = [];
        this.activeToolId = null;
        
        this.render();
    }
    
    /**
     * Render the toolbar in the container
     */
    render() {
        this.element = document.createElement('div');
        this.element.className = `pyastrator-toolbar pyastrator-toolbar-${this.options.orientation} pyastrator-toolbar-${this.options.theme}`;
        
        this.container.appendChild(this.element);
    }
    
    /**
     * Add a tool button to the toolbar
     * @param {Object} tool - Tool configuration
     * @param {string} tool.id - Unique identifier for the tool
     * @param {string} tool.icon - Icon class or URL
     * @param {string} tool.tooltip - Tooltip text
     * @param {Function} tool.action - Function to execute when tool is activated
     * @param {boolean} tool.toggle - Whether the tool stays active until another is selected
     * @returns {Toolbar} - Returns this for method chaining
     */
    addTool(tool) {
        if (!tool.id) {
            throw new Error('Tool must have an id');
        }
        
        // Check for duplicate tool id
        if (this.tools.some(t => t.id === tool.id)) {
            throw new Error(`Tool with id "${tool.id}" already exists`);
        }
        
        this.tools.push(tool);
        
        const buttonElement = document.createElement('button');
        buttonElement.className = `pyastrator-toolbar-button pyastrator-toolbar-button-${this.options.buttonSize}`;
        buttonElement.dataset.toolId = tool.id;
        
        if (tool.tooltip) {
            buttonElement.title = tool.tooltip;
        }
        
        // Add icon
        if (tool.icon) {
            if (tool.icon.startsWith('http') || tool.icon.startsWith('./') || tool.icon.startsWith('/')) {
                // It's an image URL
                const iconImg = document.createElement('img');
                iconImg.src = tool.icon;
                iconImg.alt = tool.tooltip || tool.id;
                iconImg.className = 'pyastrator-toolbar-icon';
                buttonElement.appendChild(iconImg);
            } else {
                // It's a CSS class
                const iconElement = document.createElement('i');
                iconElement.className = `pyastrator-toolbar-icon ${tool.icon}`;
                buttonElement.appendChild(iconElement);
            }
        }
        
        // Add event listener
        buttonElement.addEventListener('click', () => this.activateTool(tool.id));
        
        this.element.appendChild(buttonElement);
        
        return this;
    }
    
    /**
     * Activate a tool by its ID
     * @param {string} toolId - ID of the tool to activate
     */
    activateTool(toolId) {
        const tool = this.tools.find(t => t.id === toolId);
        if (!tool) {
            throw new Error(`Tool with id "${toolId}" not found`);
        }
        
        // Deactivate current tool if any
        if (this.activeToolId) {
            const activeButton = this.element.querySelector(`[data-tool-id="${this.activeToolId}"]`);
            if (activeButton) {
                activeButton.classList.remove('active');
            }
        }
        
        // If the clicked tool is already active and toggleable, deactivate it
        if (this.activeToolId === toolId && tool.toggle) {
            this.activeToolId = null;
            return;
        }
        
        // Activate the new tool
        this.activeToolId = toolId;
        
        if (tool.toggle) {
            const toolButton = this.element.querySelector(`[data-tool-id="${toolId}"]`);
            if (toolButton) {
                toolButton.classList.add('active');
            }
        }
        
        // Execute the tool's action
        if (typeof tool.action === 'function') {
            tool.action(tool);
        }
    }
    
    /**
     * Get the currently active tool
     * @returns {Object|null} - The active tool or null if none is active
     */
    getActiveTool() {
        if (!this.activeToolId) return null;
        return this.tools.find(t => t.id === this.activeToolId) || null;
    }
    
    /**
     * Add a separator to the toolbar
     * @returns {Toolbar} - Returns this for method chaining
     */
    addSeparator() {
        const separator = document.createElement('div');
        separator.className = 'pyastrator-toolbar-separator';
        this.element.appendChild(separator);
        return this;
    }
    
    /**
     * Add a group of tools with a label
     * @param {string} label - Group label
     * @param {Array} tools - Array of tool configurations
     * @returns {Toolbar} - Returns this for method chaining
     */
    addToolGroup(label, tools) {
        const groupElement = document.createElement('div');
        groupElement.className = 'pyastrator-toolbar-group';
        
        if (label) {
            const labelElement = document.createElement('span');
            labelElement.className = 'pyastrator-toolbar-group-label';
            labelElement.textContent = label;
            groupElement.appendChild(labelElement);
        }
        
        this.element.appendChild(groupElement);
        
        // Save current element to restore after adding group tools
        const originalElement = this.element;
        this.element = groupElement;
        
        // Add tools to the group
        tools.forEach(tool => this.addTool(tool));
        
        // Restore the original element
        this.element = originalElement;
        
        return this;
    }
    
    /**
     * Remove all tools from the toolbar
     * @returns {Toolbar} - Returns this for method chaining
     */
    clear() {
        this.tools = [];
        this.activeToolId = null;
        this.element.innerHTML = '';
        return this;
    }
    
    /**
     * Destroy the toolbar and clean up
     */
    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        this.tools = [];
        this.activeToolId = null;
    }
}

// Export the Toolbar class
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Toolbar };
} else {
    window.Pyastrator = window.Pyastrator || {};
    window.Pyastrator.Toolbar = Toolbar;
}