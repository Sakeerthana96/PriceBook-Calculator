@echo off
echo Installing required packages...
pip install -r requirements.txt

echo Running Excel to JSON conversion...
python excel_to_json.py

echo Done!
pause 