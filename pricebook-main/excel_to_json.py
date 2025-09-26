import pandas as pd
import json
import os

def convert_excel_to_json():
    # Excel file path
    excel_path = r"C:\Users\MSI\Downloads\Teceze Global Pricebook v0.1.xlsx"
    
    try:
        # Read Excel file
        df = pd.read_excel(excel_path)
        
        # Convert to list of dictionaries
        data = []
        for _, row in df.iterrows():
            item = {}
            for key, value in row.items():
                # Clean the key (remove extra spaces)
                clean_key = str(key).strip()
                
                # Clean the value
                if pd.isna(value):
                    clean_value = ""
                elif isinstance(value, (int, float)):
                    # Format numbers to 2 decimal places
                    clean_value = f"{float(value):.2f}"
                else:
                    clean_value = str(value).strip()
                
                item[clean_key] = clean_value
            
            data.append(item)
        
        # Write to JSON file
        output_path = "src/servicedata.json"
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
        
        print(f"Successfully converted Excel to JSON. Output saved to {output_path}")
        return True
        
    except Exception as e:
        print(f"Error converting Excel to JSON: {str(e)}")
        return False

if __name__ == "__main__":
    convert_excel_to_json() 