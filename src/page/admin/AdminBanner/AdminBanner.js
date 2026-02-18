import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { deleteMainBanner, getMainBanners } from '../../../features/mainBanner/mainBannerSlice';
import ConfirmDeleteModal from '../../../common/component/ConfirmDeleteModal';
import { Button, Container } from 'react-bootstrap';
import Loading from '../../../common/component/Loading';
import './style/AdminBanner.style.css';
import BannerCard from './component/BannerCard';
import ReactPaginate from 'react-paginate';
import NewItemDialog from './component/NewItemDialog';
import {setSelectedBanner} from '../../../features/mainBanner/mainBannerSlice';

const AdminBanner = () => {
  const navigate = useNavigate();
  const [query] = useSearchParams();
  const dispatch = useDispatch();
  const { banners, totalPageNum, loading } = useSelector((state) => state.mainBanner);
  const [showDialog, setShowDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState({
    page: query.get("page") || 1
  }); //검색 조건들을 저장하는 객체
  const [mode, setMode] = useState("new");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [targetBanner, setTargetBanner] = useState(null);
  
  useEffect(() => {
    dispatch(getMainBanners({...searchQuery}));
  }, [query]);

  useEffect(() => {
    //검색어나 페이지가 바뀌면 url바꿔주기 (검색어또는 페이지가 바뀜 => url 바꿔줌=> url쿼리 읽어옴=> 이 쿼리값 맞춰서  상품리스트 가져오기)
    const params = new URLSearchParams(searchQuery);
    const query = params.toString();
    navigate('?' + query);
  }, [searchQuery]);

  const deleteItem = (banner) => {
    //강의 삭제 confirm창 호출
    setTargetBanner(banner);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteMainBanner(targetBanner._id));
    setShowDeleteConfirm(false);
    setTargetBanner(null);
  };

  const openEditForm = (banner) => {
    //edit모드로 설정하고
    setMode('edit');
    // 아이템 수정다이얼로그 열어주기
    dispatch(setSelectedBanner(banner));
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
        <Loading message="배너를 불러오는 중이에요"/>
      </Container>
    )
  }

  return (
    <div className="admin-locate-center">
      <Container>
        <div className="banner-toolbar">
          <Button className="add-banner-btn" onClick={handleClickNewItem}>
            + 새 메인배너 만들기
          </Button>
        </div>

        <BannerCard
          data={banners}
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
        message={'배너를 삭제하시겠습니까?'}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}

export default AdminBanner
