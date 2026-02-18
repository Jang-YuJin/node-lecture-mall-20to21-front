import React, { useEffect, useState } from "react";
import { Container, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import SearchBox from "../../../common/component/SearchBox";
import NewItemDialog from "./component/NewItemDialog";
import ProductTable from "./component/ProductTable";
import './style/sellerLecture.style.css'
import {
  getLectureList,
  deleteLecture,
  setSelectedLecture,
} from "../../../features/lecture/lectureSlice";
import Loading from "../../../common/component/Loading";
import ConfirmDeleteModal from "../../../common/component/ConfirmDeleteModal";

const SellerLecturePage = () => {
  const navigate = useNavigate();
  const [query] = useSearchParams();
  const dispatch = useDispatch();
  const { lectureList, totalPageNum, loading } = useSelector((state) => state.lecture);
  const [showDialog, setShowDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState({
    page: query.get("page") || 1,
    name: query.get("name") || "",
    userId: query.get("userId") || ""
  }); //검색 조건들을 저장하는 객체
  const [mode, setMode] = useState("new");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [targetLecture, setTargetLecture] = useState(null);

  //상품리스트 가져오기 (url쿼리 맞춰서)
    useEffect(() => {
    dispatch(getLectureList({...searchQuery}));
  }, [query]);

  useEffect(() => {
    //검색어나 페이지가 바뀌면 url바꿔주기 (검색어또는 페이지가 바뀜 => url 바꿔줌=> url쿼리 읽어옴=> 이 쿼리값 맞춰서  상품리스트 가져오기)
    if(searchQuery.name === ''){
      delete searchQuery.name;
    }
    const params = new URLSearchParams(searchQuery);
    const query = params.toString();
    navigate('?' + query);
  }, [searchQuery]);

  const deleteItem = (lecture) => {
    //강의 삭제 confirm창 호출
    setTargetLecture(lecture);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteLecture(targetLecture._id));
    setShowDeleteConfirm(false);
    setTargetLecture(null);
  };

  const openEditForm = (lecture) => {
    //edit모드로 설정하고
    setMode('edit');
    // 아이템 수정다이얼로그 열어주기
    dispatch(setSelectedLecture(lecture));
    setShowDialog(true);
  };

  const handleClickNewItem = () => {
    //new 모드로 설정하고
    setMode('new');
    // 다이얼로그 열어주기
    setShowDialog(true);
  };

  const handlePageClick = ({ selected }) => {
    //  쿼리에 페이지값 바꿔주기
    setSearchQuery({...searchQuery, page: selected + 1});
  };

  if(loading){
    return(
      <Container>
        <Loading message="강의를 불러오는 중이에요"/>
      </Container>
    )
  }

  return (
    <div className="seller-locate-center">
      <Container>
        <div className="mt-2">
          <SearchBox
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder="강의명으로 검색"
            field="name"
          />
        </div>
        <div className="lecture-toolbar">
          <Button className="add-lecture-btn" onClick={handleClickNewItem}>
            + 새 강의 만들기
          </Button>
        </div>

        <ProductTable
          data={lectureList}
          deleteItem={deleteItem}
          openEditForm={openEditForm}
        />
        <ReactPaginate
          previousLabel="‹"
          nextLabel="›"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={totalPageNum}
          forcePage={searchQuery.page - 1}
          containerClassName="cs-pagination"

          pageClassName="cs-page"
          pageLinkClassName="cs-page-link"

          previousClassName="cs-page cs-nav-btn"
          nextClassName="cs-page cs-nav-btn"
          previousLinkClassName="cs-page-link"
          nextLinkClassName="cs-page-link"

          activeClassName="active"
        />
      </Container>

      <NewItemDialog
        mode={mode}
        showDialog={showDialog}
        setShowDialog={setShowDialog}
      />

      <ConfirmDeleteModal
        show={showDeleteConfirm}
        message={`'${targetLecture?.name}' 강의를 삭제하시겠습니까?`}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default SellerLecturePage;
