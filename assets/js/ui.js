
// UI Components Initialization Script
document.addEventListener('DOMContentLoaded', function() {
    initCustomSelect();             // Custom select box
    initSearchInputDeleteButton();  // Search input delete button
    initTableScroll();              // Horizontal table scroll
    initFileInput();                // File input handler
    initMultiFileDropArea();        // Multi-file drop area handler
    initLeftMenu();                 // Left menu animation
});

// jQuery Datepicker Initialization
$(function() {
    $("#datepicker").datepicker({
        dateFormat: 'yy-mm-dd' //달력 날짜 형태
        ,showOtherMonths: true //빈 공간에 현재월의 앞뒤월의 날짜를 표시
        ,showMonthAfterYear:true // 월- 년 순서가아닌 년도 - 월 순서
        ,changeYear: true //option값 년 선택 가능
        ,changeMonth: true //option값  월 선택 가능                
        ,showOn: "both" //button:버튼을 표시하고,버튼을 눌러야만 달력 표시 ^ both:버튼을 표시하고,버튼을 누르거나 input을 클릭하면 달력 표시 
        ,buttonImageOnly: false //버튼 이미지만 깔끔하게 보이게함
        ,buttonText: false //버튼 호버 텍스트              
        ,yearSuffix: "년" //달력의 년도 부분 뒤 텍스트
        ,monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'] //달력의 월 부분 텍스트
        ,monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'] //달력의 월 부분 Tooltip
        ,dayNamesMin: ['일','월','화','수','목','금','토'] //달력의 요일 텍스트
        ,dayNames: ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'] //달력의 요일 Tooltip
        ,minDate: "-5Y" //최소 선택일자(-1D:하루전, -1M:한달전, -1Y:일년전)
        ,maxDate: "+5y" //최대 선택일자(+1D:하루후, -1M:한달후, -1Y:일년후)  
    });
});

// Custom Select Initialization
function initCustomSelect() {
    const customSelects = document.getElementsByClassName("customSelect");
    if (customSelects.length === 0) return;

    for (let i = 0; i < customSelects.length; i++) {
        const selectEl = customSelects[i].getElementsByTagName("select")[0];
        const selectedDiv = document.createElement("DIV");
        selectedDiv.setAttribute("class", "selectSelected");
        selectedDiv.innerHTML = selectEl.options[selectEl.selectedIndex].innerHTML;
        if (selectEl.disabled) selectedDiv.classList.add("disabled");
        customSelects[i].appendChild(selectedDiv);

        const itemsContainer = document.createElement("DIV");
        const itemList = document.createElement("ul");
        itemsContainer.setAttribute("class", "selectItems selectHide");
        itemList.setAttribute("class", "selectItemsList");
        itemsContainer.appendChild(itemList);

        for (let j = 1; j < selectEl.length; j++) {
            const item = document.createElement("li");
            item.innerHTML = selectEl.options[j].innerHTML;
            item.addEventListener("click", function() {
                selectEl.selectedIndex = j;
                selectedDiv.innerHTML = this.innerHTML;
                const prevSelected = itemsContainer.getElementsByClassName("sameAsSelected");
                for (const el of prevSelected) el.removeAttribute("class");
                this.setAttribute("class", "sameAsSelected");
                selectedDiv.click();
            });
            itemList.appendChild(item);
        }
        customSelects[i].appendChild(itemsContainer);

        selectedDiv.addEventListener("click", function(e) {
            if (this.classList.contains("disabled")) return;
            e.stopPropagation();
            closeAllSelect(this);
            this.nextSibling.classList.toggle("selectHide");
            this.classList.toggle("selectArrowActive");
            this.classList.toggle("action");
        });
    }

    function closeAllSelect(current) {
        const items = document.getElementsByClassName("selectItems");
        const selected = document.getElementsByClassName("selectSelected");
        for (let i = 0; i < selected.length; i++) {
            if (current !== selected[i]) {
                selected[i].classList.remove("selectArrowActive", "action");
                items[i].classList.add("selectHide");
            }
        }
    }

    document.addEventListener("click", closeAllSelect);
}

// Search Input Delete Button Initialization
function initSearchInputDeleteButton() {
    const searchInputs = document.querySelectorAll(".searchInput");
    if (searchInputs.length === 0) return;

    searchInputs.forEach(input => {
        const deleteBtn = input.parentElement.querySelector(".deleteButton");

        input.addEventListener("input", () => {
            deleteBtn.classList.toggle("hide", input.value.trim() === "");
        });

        deleteBtn.addEventListener("click", () => {
            input.value = "";
        });

        if (input.value.trim() !== "") deleteBtn.classList.remove("hide");
    });
}

// Table Scroll Initialization
function initTableScroll() {
    const table = document.querySelector('.tableBody');
    if (!table) return;

    let isDown = false, startX, scrollStart;

    table.addEventListener('mousedown', e => {
        isDown = true;
        startX = e.pageX - table.offsetLeft;
        scrollStart = table.scrollLeft;
    });

    ['mouseup', 'mouseleave'].forEach(event => {
        table.addEventListener(event, () => isDown = false);
    });

    table.addEventListener('mousemove', e => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - table.offsetLeft;
        table.scrollLeft = scrollStart - (x - startX);
    });
}

// File Input Initialization
function initFileInput() {
    const fileInput = document.querySelector('.fileInp');
    if (!fileInput) return;
    const fileNameInput = document.querySelector('.fileTxt');

    fileInput.addEventListener('change', function() {
        fileNameInput.value = this.files[0]?.name || '';
    });
}

// Multi-File Drop Area Initialization
function initMultiFileDropArea() {
    const dropArea = document.getElementById('dropArea');
    if (!dropArea) return;

    const draopBox = dropArea.querySelector('.draopBox');
    const drapZone = dropArea.querySelector('.drapZone');
    const onlyTable = dropArea.querySelector('.onlyTableArea');
    const fileInput = dropArea.querySelector('.mutiFile');
    const tableBody = dropArea.querySelector('tbody');
    const addBtn = dropArea.querySelector('.ic_plus');
    const delBtn = dropArea.querySelector('.ic_delete');
    const masterChk = document.getElementById('atchCheck');

    onlyTable.style.display = 'none';

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evt => {
        dropArea.addEventListener(evt, e => {
            e.preventDefault();
            e.stopPropagation();
            if (evt === 'dragenter' || evt === 'dragover') dropArea.classList.add('highlight');
            else dropArea.classList.remove('highlight');
        });
    });

    dropArea.addEventListener('drop', e => handleFiles(e.dataTransfer.files));
    fileInput.addEventListener('change', () => handleFiles(fileInput.files));
    addBtn.addEventListener('click', () => fileInput.click());

    delBtn.addEventListener('click', () => {
        tableBody.querySelectorAll('input[type="checkbox"]:checked').forEach(chk => chk.closest('tr').remove());
        masterChk.checked = false;
        updateView();
    });

    masterChk.addEventListener('change', () => {
        tableBody.querySelectorAll('input[type="checkbox"]').forEach(chk => chk.checked = masterChk.checked);
    });

    function handleFiles(files) {
        [...files].forEach(file => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><div class="checkbox"><input type="checkbox" id="ch_${file.name}"><label for="ch_${file.name}"></label></div></td>
                <td>${file.name}</td>
                <td>${(file.size / 1024 / 1024).toFixed(3)} MB</td>
                <td>${file.type || 'Unknown'}</td>`;
            tableBody.appendChild(row);
        });
        updateView();
    }

    function updateView() {
        const hasFiles = tableBody.children.length > 0;
        drapZone.style.display = hasFiles ? 'none' : 'block';
        onlyTable.style.display = hasFiles ? 'block' : 'none';
        draopBox.classList.toggle('act', hasFiles);
    }
}

// Left Menu Initialization
function initLeftMenu() {
    const boxes = document.querySelectorAll('.leftMenu .menuBox');
    if (boxes.length === 0) return;
    const items = document.querySelectorAll('.leftMenu .menuList li');

    boxes.forEach(box => {
        const title = box.querySelector('.title');
        const list = box.querySelector('ul');

        list.style.height = box.classList.contains('act') ? list.scrollHeight + 'px' : '0';

        title.addEventListener('click', () => {
            const isActive = box.classList.contains('act');
            boxes.forEach(b => closeMenu(b, b.querySelector('ul')));
            if (!isActive) openMenu(box, list);
        });
    });

    items.forEach(item => {
        item.addEventListener('click', () => {
            items.forEach(i => i.classList.remove('act'));
            item.classList.add('act');
        });
    });

    function openMenu(box, list) {
        box.classList.add('act');
        list.style.height = list.scrollHeight + 'px';
    }

    function closeMenu(box, list) {
        box.classList.remove('act');
        list.style.height = '0';
    }
}

//layout Lnb
$(function () {
  // depth01 메뉴 클릭 시 토글
  $('.Lnb .depth01 > span').on('click', function () {
    const $parent = $(this).parent();

    // 이미 열려있는 경우는 닫기만
    if ($parent.hasClass('act')) {
      $parent.removeClass('act');
    } else {
      // 다른 메뉴 닫고, 현재만 열기
      $('.Lnb .depth01').removeClass('act');
      $parent.addClass('act');
    }
  });

  // depth02 메뉴 클릭 시 act 클래스 추가 (선택 표시용)
  $('.Lnb .depth02 li a').on('click', function (e) {
    e.preventDefault(); // 링크 이동 방지 (원하면 제거 가능)
    
    // 같은 그룹의 li 안에서 act 제거하고 클릭한 것만 추가
    $(this).closest('.depth02').find('a').removeClass('act');
    $(this).addClass('act');
  });

   // gnb 메뉴 클릭 시 act 클래스 추가 (선택 표시용)
   $('.Gnb a').on('click', function (e) {
    e.preventDefault(); // 링크 이동 방지 (원하면 제거 가능)
    
    // 같은 그룹의 li 안에서 act 제거하고 클릭한 것만 추가
    $('.Gnb a').removeClass('act');
    $(this).addClass('act');
  });
});

//모달 팝업
$(document).ready(function() {
  function toggleModal(modalId, isOpen) {
      if (isOpen) {
      $(modalId).fadeIn();
      $("body").css("overflow", "hidden");
      } else {
      $(modalId).fadeOut();
      $("body").css("overflow", "auto");
      }
  }

  // 모달 열기 버튼에만 이벤트 바인딩
  $("#modal-modalOpen, #modal-loadingOpen").click(function (event) {
      event.preventDefault();
      var target = $(this).data("target");
      if (target) {
      toggleModal(target, true);
      }
  });

  // 닫기 버튼 클릭 시 모달 닫기
  $("#closeModal").click(function () {
      toggleModal($(this).closest(".modal-mask"), false);
  });
});