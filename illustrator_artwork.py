import win32com.client
import sys

def create_circle(doc, center_x, center_y, radius):
    """
    Creates a circle (as an ellipse with equal width and height) in the document.
    Illustrator’s Ellipse method takes the top, left, width, and height of the bounding box.
    """
    # Calculate the top and left for the bounding box
    top = center_y + radius  # top is the y-coordinate of the top of the bounding rectangle
    left = center_x - radius  # left is the x-coordinate of the left of the bounding rectangle
    circle = doc.PathItems.Ellipse(top, left, 2 * radius, 2 * radius)
    circle.Filled = True
    # Assign the first swatch's color as the fill color
    circle.FillColor = doc.Swatches.Item(0).Color
    return circle

def create_rectangle(doc, top, left, width, height):
    """
    Creates a rectangle in the document.
    Illustrator’s Rectangle method takes the top, left, width, and height.
    """
    rect = doc.PathItems.Rectangle(top, left, width, height)
    rect.Filled = True
    rect.FillColor = doc.Swatches.Item(0).Color
    return rect

def create_triangle(doc, center_x, center_y, radius):
    """
    Creates a triangle (polygon with 3 sides) in the document.
    The Polygon method takes the center coordinates, a radius, and the number of sides.
    """
    triangle = doc.PathItems.Polygon(center_x, center_y, radius, 3)
    triangle.Filled = True
    triangle.FillColor = doc.Swatches.Item(0).Color
    return triangle

def create_artwork(prompt):
    try:
        # Connect to Adobe Illustrator via COM automation
        ai = win32com.client.Dispatch("Illustrator.Application")
    except Exception as e:
        print("Error: Could not connect to Adobe Illustrator. Make sure it is running.")
        sys.exit(1)
    
    # Create a new document with default settings
    doc = ai.Documents.Add()
    
    prompt_lower = prompt.lower()
    
    # Create a circle if mentioned in the prompt
    if "circle" in prompt_lower:
        print("Creating a circle...")
        create_circle(doc, center_x=300, center_y=300, radius=100)
    
    # Create a rectangle if mentioned in the prompt
    if "rectangle" in prompt_lower:
        print("Creating a rectangle...")
        # Create a rectangle with a width of 150 and height of 100.
        create_rectangle(doc, top=400, left=200, width=150, height=100)
    
    # Create a triangle if mentioned in the prompt
    if "triangle" in prompt_lower:
        print("Creating a triangle...")
        create_triangle(doc, center_x=500, center_y=300, radius=80)
    
    print("Artwork created based on prompt:", prompt)

if __name__ == "__main__":
    # Request an artwork description from the user.
    prompt = input("Enter artwork description (include keywords like circle, rectangle, triangle): ")
    create_artwork(prompt)
