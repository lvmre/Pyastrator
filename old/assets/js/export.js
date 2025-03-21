/**
 * export.js - Handles exporting functionality for Pyastrator
 */

const ExportManager = (function() {
    // Track export status
    let exportInProgress = false;
    
    /**
     * Trigger file download in browser
     * @param {string} content - The content to download
     * @param {string} filename - The default filename
     * @param {string} type - MIME type of the file
     */
    function downloadFile(content, filename, type) {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';
        
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    }
    
    // Public API
    return {
        /**
         * Export data as JSON file
         * @param {Object} data - Data to export
         * @param {string} filename - Default filename
         */
        exportJSON: function(data, filename = 'pyastrator-data.json') {
            if (exportInProgress) return false;
            exportInProgress = true;
            
            try {
                const jsonContent = JSON.stringify(data, null, 2);
                downloadFile(jsonContent, filename, 'application/json');
                return true;
            } catch (error) {
                console.error('JSON export failed:', error);
                return false;
            } finally {
                exportInProgress = false;
            }
        },
        
        /**
         * Export canvas as image
         * @param {HTMLCanvasElement} canvas - Canvas element to export
         * @param {string} filename - Default filename
         * @param {string} format - Image format (png, jpeg)
         */
        exportImage: function(canvas, filename = 'pyastrator-image.png', format = 'png') {
            if (exportInProgress) return false;
            exportInProgress = true;
            
            try {
                const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
                const dataUrl = canvas.toDataURL(mimeType);
                
                const a = document.createElement('a');
                a.href = dataUrl;
                a.download = filename;
                a.click();
                
                return true;
            } catch (error) {
                console.error('Image export failed:', error);
                return false;
            } finally {
                exportInProgress = false;
            }
        },
        
        /**
         * Check if export is currently in progress
         */
        isExportInProgress: function() {
            return exportInProgress;
        }
    };
})();

// Make the export manager available globally
window.ExportManager = ExportManager;