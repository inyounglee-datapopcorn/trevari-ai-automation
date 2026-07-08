import json
import time
from bs4 import BeautifulSoup

def parse_trevari_html(html_content):
    """
    트레바리 독후감 페이지의 HTML 구조를 분석하여 제출자 목록을 추출합니다.
    (실제 트레바리 DOM 구조에 맞게 선택자 수정이 필요할 수 있습니다.)
    """
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # 예시: 독후감 작성자의 이름이 들어있는 클래스를 찾습니다.
    # 클래스명은 트레바리 웹사이트 구조 확인 후 수정해야 합니다.
    author_elements = soup.select('.review-author-name') 
    
    submitted_members = []
    for el in author_elements:
        name = el.get_text(strip=True)
        if name not in submitted_members:
            submitted_members.append(name)
            
    return submitted_members

def update_dashboard_data(submitted_members, target_date="2026-07-10"):
    """
    크롤링한 데이터를 바탕으로 대시보드용 data.json을 업데이트합니다.
    """
    json_path = '../dashboard/data.json'
    
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except FileNotFoundError:
        print("data.json 파일을 찾을 수 없습니다.")
        return
        
    # 제출 여부 업데이트 로직
    for member in data['members']:
        record_key = f"{target_date}_review"
        if member in submitted_members:
            if member not in data['records']:
                data['records'][member] = {}
            data['records'][member][record_key] = True
        else:
            if member not in data['records']:
                data['records'][member] = {}
            # 없으면 False 유지 (또는 명시적으로 False 할당)
            data['records'][member][record_key] = False
            
    # 파일 저장
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        
    print(f"업데이트 완료! {len(submitted_members)}명의 독후감이 확인되었습니다.")

if __name__ == "__main__":
    # --- 자동화 실행 방법 ---
    # 1. 셀레니움(Selenium)이나 플레이라이트(Playwright)를 사용해 로그인 과정을 자동화하거나,
    # 2. 브라우저에서 '독후감 페이지'의 HTML을 복사해서 로컬 파일(source.html)로 저장 후 읽어옵니다.
    
    try:
        with open('source.html', 'r', encoding='utf-8') as f:
            html = f.read()
        
        # 1. 제출자 파싱
        submitted_list = parse_trevari_html(html)
        print("제출자 목록:", submitted_list)
        
        # 2. JSON 업데이트
        update_dashboard_data(submitted_list, target_date="2026-07-10")
        
    except FileNotFoundError:
        print("source.html 파일이 필요합니다. 트레바리 페이지 소스를 저장해주세요.")
