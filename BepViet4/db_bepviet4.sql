-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th1 16, 2026 lúc 08:11 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `db_bepviet4`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `bai_viet`
--

CREATE TABLE `bai_viet` (
  `ma_bai_viet` int(10) UNSIGNED NOT NULL,
  `ma_nguoi_dung` int(10) UNSIGNED NOT NULL,
  `tieu_de` varchar(255) NOT NULL,
  `noi_dung` text NOT NULL,
  `hinh_anh_dai_dien` text DEFAULT NULL,
  `ngay_dang` datetime NOT NULL DEFAULT current_timestamp(),
  `ngay_chinh` datetime NOT NULL DEFAULT current_timestamp(),
  `luot_yeu_thich` int(11) DEFAULT 0,
  `luot_chia_se` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `binh_luan`
--

CREATE TABLE `binh_luan` (
  `ma_binh_luan` int(10) UNSIGNED NOT NULL,
  `ma_nguoi_dung` int(10) UNSIGNED NOT NULL,
  `ma_cong_thuc` int(10) UNSIGNED NOT NULL,
  `ma_binh_luan_cha` int(10) UNSIGNED DEFAULT NULL,
  `noi_dung` text NOT NULL,
  `ngay_gui` datetime NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `binh_luan_bai_viet`
--

CREATE TABLE `binh_luan_bai_viet` (
  `ma_binh_luan` int(10) UNSIGNED NOT NULL,
  `ma_nguoi_dung` int(10) UNSIGNED NOT NULL,
  `ma_bai_viet` int(10) UNSIGNED NOT NULL,
  `ma_binh_luan_cha` int(10) UNSIGNED DEFAULT NULL,
  `noi_dung` text NOT NULL,
  `ngay_gui` datetime NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `bo_suu_tap`
--

CREATE TABLE `bo_suu_tap` (
  `ma_bo_suu_tap` int(10) UNSIGNED NOT NULL,
  `ma_nguoi_dung` int(10) UNSIGNED NOT NULL,
  `ten_bo_suu_tap` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `buoc_thuc_hien`
--

CREATE TABLE `buoc_thuc_hien` (
  `ma_buoc` int(10) UNSIGNED NOT NULL,
  `ma_cong_thuc` int(10) UNSIGNED NOT NULL,
  `so_thu_tu` int(11) NOT NULL,
  `noi_dung` text NOT NULL,
  `thoi_gian` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chi_tiet_bo_suu_tap`
--

CREATE TABLE `chi_tiet_bo_suu_tap` (
  `ma_bo_suu_tap` int(10) UNSIGNED NOT NULL,
  `ma_cong_thuc` int(10) UNSIGNED NOT NULL,
  `ngay_them` datetime NOT NULL DEFAULT current_timestamp(),
  `ghi_chu` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cong_thuc`
--

CREATE TABLE `cong_thuc` (
  `ma_cong_thuc` int(10) UNSIGNED NOT NULL,
  `ma_nguoi_dung` int(10) UNSIGNED NOT NULL,
  `ma_danh_muc` int(10) UNSIGNED DEFAULT NULL,
  `ma_vung_mien` int(10) UNSIGNED DEFAULT NULL,
  `ten_mon` varchar(200) NOT NULL,
  `mo_ta` text DEFAULT NULL,
  `thoi_gian_nau` int(11) DEFAULT NULL,
  `khau_phan` int(11) DEFAULT NULL,
  `do_kho` tinyint(4) DEFAULT NULL,
  `ngay_tao` datetime NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cong_thuc_nguyen_lieu`
--

CREATE TABLE `cong_thuc_nguyen_lieu` (
  `ma_cong_thuc` int(10) UNSIGNED NOT NULL,
  `ma_nguyen_lieu` int(10) UNSIGNED NOT NULL,
  `dinh_luong` double UNSIGNED NOT NULL,
  `don_vi_tinh` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cong_thuc_the`
--

CREATE TABLE `cong_thuc_the` (
  `ma_cong_thuc` int(10) UNSIGNED NOT NULL,
  `ma_the` int(10) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `danh_gia`
--

CREATE TABLE `danh_gia` (
  `ma_danh_gia` int(10) UNSIGNED NOT NULL,
  `ma_nguoi_dung` int(10) UNSIGNED NOT NULL,
  `ma_cong_thuc` int(10) UNSIGNED NOT NULL,
  `so_sao` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `danh_muc`
--

CREATE TABLE `danh_muc` (
  `ma_danh_muc` int(10) UNSIGNED NOT NULL,
  `ten_danh_muc` varchar(100) NOT NULL,
  `mo_ta` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `danh_sach_mua_sam`
--

CREATE TABLE `danh_sach_mua_sam` (
  `ma_mua_sam` int(10) UNSIGNED NOT NULL,
  `ma_nguoi_dung` int(10) UNSIGNED NOT NULL,
  `ma_nguyen_lieu` int(10) UNSIGNED NOT NULL,
  `so_luong_can` double NOT NULL,
  `don_vi` varchar(20) NOT NULL,
  `trang_thai` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hinh_anh_bai_viet`
--

CREATE TABLE `hinh_anh_bai_viet` (
  `ma_hinh_anh` int(10) UNSIGNED NOT NULL,
  `ma_bai_viet` int(10) UNSIGNED NOT NULL,
  `duong_dan` text DEFAULT NULL,
  `mo_ta` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hinh_anh_buoc`
--

CREATE TABLE `hinh_anh_buoc` (
  `ma_hinh_anh` int(10) UNSIGNED NOT NULL,
  `ma_buoc` int(10) UNSIGNED NOT NULL,
  `duong_dan` text DEFAULT NULL,
  `mo_ta` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hinh_anh_cong_thuc`
--

CREATE TABLE `hinh_anh_cong_thuc` (
  `ma_hinh_anh` int(10) UNSIGNED NOT NULL,
  `ma_cong_thuc` int(10) UNSIGNED NOT NULL,
  `duong_dan` text DEFAULT NULL,
  `mo_ta` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000001_create_cache_table', 1),
(2, '0001_01_01_000002_create_jobs_table', 1),
(3, '2026_01_15_000003_create__nguoi__dung_table', 1),
(4, '2026_01_15_000004_create_danh_muc_table', 1),
(5, '2026_01_15_000005_create_vung_mien_table', 1),
(6, '2026_01_15_000006_create_nguyen_lieu_table', 1),
(7, '2026_01_15_000007_create_the_table', 1),
(8, '2026_01_15_000009_create_cong_thuc_table', 1),
(9, '2026_01_15_000014_create__thuc_don_table', 1),
(10, '2026_01_15_000015_create_danh_gia_table', 1),
(11, '2026_01_15_000016_create_bo_suu_tap_table', 1),
(12, '2026_01_15_000017_create__chi_tiet_bo_suu_tap_table', 1),
(13, '2026_01_15_000020_create_cong_thuc_the_table', 1),
(14, '2026_01_15_000020_create_danh_sach_mua_sam_table', 1),
(15, '2026_01_15_000020_create_hinh_anh_cong_thuc_table', 1),
(16, '2026_01_15_000021_create_binh_luan_table', 1),
(17, '2026_01_15_000021_create_buoc_thuc_hien_table', 1),
(18, '2026_01_15_000021_create_cong_thuc_nguyen_lieu_table', 1),
(19, '2026_01_16_000020_create_theo_doi', 1),
(20, '2026_01_16_000021_create_bai_viet', 1),
(21, '2026_01_16_000022_create_hinh_anh_bai_viet', 1),
(22, '2026_01_16_000023_create_video_huong_dan', 1),
(23, '2026_01_16_000024_create_hinh_anh_buoc', 1),
(24, '2026_01_16_000025_create_binh_luan_bai_viet', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `nguoi_dung`
--

CREATE TABLE `nguoi_dung` (
  `ma_nguoi_dung` int(10) UNSIGNED NOT NULL,
  `ten_dang_nhap` varchar(100) NOT NULL,
  `mat_khau` varchar(100) NOT NULL,
  `email` varchar(50) NOT NULL,
  `ho_ten` varchar(100) NOT NULL,
  `ngay_sinh` date DEFAULT NULL,
  `gioi_tinh` enum('Nam','Nữ','Khác') DEFAULT NULL,
  `vai_tro` enum('Admin','User','DauBep') NOT NULL DEFAULT 'User',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `nguyen_lieu`
--

CREATE TABLE `nguyen_lieu` (
  `ma_nguyen_lieu` int(10) UNSIGNED NOT NULL,
  `ten_nguyen_lieu` varchar(255) NOT NULL,
  `loai_nguyen_lieu` varchar(100) NOT NULL,
  `hinh_anh` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `the`
--

CREATE TABLE `the` (
  `ma_the` int(10) UNSIGNED NOT NULL,
  `ten_the` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `theo_doi`
--

CREATE TABLE `theo_doi` (
  `ma_nguoi_theo_doi` int(10) UNSIGNED NOT NULL,
  `ma_nguoi_duoc_theo_doi` int(10) UNSIGNED NOT NULL,
  `ngay_theo_doi` datetime NOT NULL DEFAULT current_timestamp(),
  `trang_thai` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `thuc_don`
--

CREATE TABLE `thuc_don` (
  `ma_thuc_don` int(10) UNSIGNED NOT NULL,
  `ma_nguoi_dung` int(10) UNSIGNED NOT NULL,
  `ma_cong_thuc` int(10) UNSIGNED NOT NULL,
  `ngay_an` date NOT NULL,
  `buoi` enum('Sáng','Trưa','Tối','Phụ') NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `video_huong_dan`
--

CREATE TABLE `video_huong_dan` (
  `ma_video` int(10) UNSIGNED NOT NULL,
  `ma_cong_thuc` int(10) UNSIGNED NOT NULL,
  `tieu_de_video` varchar(100) NOT NULL,
  `duong_dan_video` text DEFAULT NULL,
  `nen_tang` varchar(200) DEFAULT NULL,
  `thoi_luong` int(10) UNSIGNED DEFAULT NULL,
  `la_video_chinh` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `vung_mien`
--

CREATE TABLE `vung_mien` (
  `ma_vung_mien` int(10) UNSIGNED NOT NULL,
  `ten_vung_mien` varchar(100) NOT NULL,
  `mo_ta` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `bai_viet`
--
ALTER TABLE `bai_viet`
  ADD PRIMARY KEY (`ma_bai_viet`),
  ADD KEY `bai_viet_ma_nguoi_dung_foreign` (`ma_nguoi_dung`);

--
-- Chỉ mục cho bảng `binh_luan`
--
ALTER TABLE `binh_luan`
  ADD PRIMARY KEY (`ma_binh_luan`),
  ADD KEY `binh_luan_ma_nguoi_dung_foreign` (`ma_nguoi_dung`),
  ADD KEY `binh_luan_ma_cong_thuc_foreign` (`ma_cong_thuc`),
  ADD KEY `binh_luan_ma_binh_luan_cha_foreign` (`ma_binh_luan_cha`);

--
-- Chỉ mục cho bảng `binh_luan_bai_viet`
--
ALTER TABLE `binh_luan_bai_viet`
  ADD PRIMARY KEY (`ma_binh_luan`),
  ADD KEY `binh_luan_bai_viet_ma_nguoi_dung_foreign` (`ma_nguoi_dung`),
  ADD KEY `binh_luan_bai_viet_ma_bai_viet_foreign` (`ma_bai_viet`),
  ADD KEY `binh_luan_bai_viet_ma_binh_luan_cha_foreign` (`ma_binh_luan_cha`);

--
-- Chỉ mục cho bảng `bo_suu_tap`
--
ALTER TABLE `bo_suu_tap`
  ADD PRIMARY KEY (`ma_bo_suu_tap`),
  ADD KEY `bo_suu_tap_ma_nguoi_dung_foreign` (`ma_nguoi_dung`);

--
-- Chỉ mục cho bảng `buoc_thuc_hien`
--
ALTER TABLE `buoc_thuc_hien`
  ADD PRIMARY KEY (`ma_buoc`),
  ADD KEY `buoc_thuc_hien_ma_cong_thuc_foreign` (`ma_cong_thuc`);

--
-- Chỉ mục cho bảng `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Chỉ mục cho bảng `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Chỉ mục cho bảng `chi_tiet_bo_suu_tap`
--
ALTER TABLE `chi_tiet_bo_suu_tap`
  ADD PRIMARY KEY (`ma_bo_suu_tap`,`ma_cong_thuc`),
  ADD KEY `chi_tiet_bo_suu_tap_ma_cong_thuc_foreign` (`ma_cong_thuc`);

--
-- Chỉ mục cho bảng `cong_thuc`
--
ALTER TABLE `cong_thuc`
  ADD PRIMARY KEY (`ma_cong_thuc`),
  ADD KEY `cong_thuc_ma_nguoi_dung_foreign` (`ma_nguoi_dung`),
  ADD KEY `cong_thuc_ma_danh_muc_foreign` (`ma_danh_muc`),
  ADD KEY `cong_thuc_ma_vung_mien_foreign` (`ma_vung_mien`);

--
-- Chỉ mục cho bảng `cong_thuc_nguyen_lieu`
--
ALTER TABLE `cong_thuc_nguyen_lieu`
  ADD PRIMARY KEY (`ma_cong_thuc`,`ma_nguyen_lieu`),
  ADD KEY `cong_thuc_nguyen_lieu_ma_nguyen_lieu_foreign` (`ma_nguyen_lieu`);

--
-- Chỉ mục cho bảng `cong_thuc_the`
--
ALTER TABLE `cong_thuc_the`
  ADD PRIMARY KEY (`ma_cong_thuc`,`ma_the`),
  ADD KEY `cong_thuc_the_ma_the_foreign` (`ma_the`);

--
-- Chỉ mục cho bảng `danh_gia`
--
ALTER TABLE `danh_gia`
  ADD PRIMARY KEY (`ma_danh_gia`),
  ADD UNIQUE KEY `danh_gia_ma_nguoi_dung_ma_cong_thuc_unique` (`ma_nguoi_dung`,`ma_cong_thuc`),
  ADD KEY `danh_gia_ma_cong_thuc_foreign` (`ma_cong_thuc`);

--
-- Chỉ mục cho bảng `danh_muc`
--
ALTER TABLE `danh_muc`
  ADD PRIMARY KEY (`ma_danh_muc`),
  ADD UNIQUE KEY `danh_muc_ten_danh_muc_unique` (`ten_danh_muc`);

--
-- Chỉ mục cho bảng `danh_sach_mua_sam`
--
ALTER TABLE `danh_sach_mua_sam`
  ADD PRIMARY KEY (`ma_mua_sam`),
  ADD KEY `danh_sach_mua_sam_ma_nguoi_dung_foreign` (`ma_nguoi_dung`),
  ADD KEY `danh_sach_mua_sam_ma_nguyen_lieu_foreign` (`ma_nguyen_lieu`);

--
-- Chỉ mục cho bảng `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Chỉ mục cho bảng `hinh_anh_bai_viet`
--
ALTER TABLE `hinh_anh_bai_viet`
  ADD PRIMARY KEY (`ma_hinh_anh`),
  ADD KEY `hinh_anh_bai_viet_ma_bai_viet_foreign` (`ma_bai_viet`);

--
-- Chỉ mục cho bảng `hinh_anh_buoc`
--
ALTER TABLE `hinh_anh_buoc`
  ADD PRIMARY KEY (`ma_hinh_anh`),
  ADD KEY `hinh_anh_buoc_ma_buoc_foreign` (`ma_buoc`);

--
-- Chỉ mục cho bảng `hinh_anh_cong_thuc`
--
ALTER TABLE `hinh_anh_cong_thuc`
  ADD PRIMARY KEY (`ma_hinh_anh`),
  ADD KEY `hinh_anh_cong_thuc_ma_cong_thuc_foreign` (`ma_cong_thuc`);

--
-- Chỉ mục cho bảng `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Chỉ mục cho bảng `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `nguoi_dung`
--
ALTER TABLE `nguoi_dung`
  ADD PRIMARY KEY (`ma_nguoi_dung`),
  ADD UNIQUE KEY `nguoi_dung_ten_dang_nhap_unique` (`ten_dang_nhap`),
  ADD UNIQUE KEY `nguoi_dung_email_unique` (`email`);

--
-- Chỉ mục cho bảng `nguyen_lieu`
--
ALTER TABLE `nguyen_lieu`
  ADD PRIMARY KEY (`ma_nguyen_lieu`),
  ADD UNIQUE KEY `nguyen_lieu_ten_nguyen_lieu_unique` (`ten_nguyen_lieu`);

--
-- Chỉ mục cho bảng `the`
--
ALTER TABLE `the`
  ADD PRIMARY KEY (`ma_the`),
  ADD UNIQUE KEY `the_ten_the_unique` (`ten_the`);

--
-- Chỉ mục cho bảng `theo_doi`
--
ALTER TABLE `theo_doi`
  ADD PRIMARY KEY (`ma_nguoi_theo_doi`,`ma_nguoi_duoc_theo_doi`),
  ADD KEY `theo_doi_ma_nguoi_duoc_theo_doi_foreign` (`ma_nguoi_duoc_theo_doi`);

--
-- Chỉ mục cho bảng `thuc_don`
--
ALTER TABLE `thuc_don`
  ADD PRIMARY KEY (`ma_thuc_don`),
  ADD KEY `thuc_don_ma_nguoi_dung_foreign` (`ma_nguoi_dung`),
  ADD KEY `thuc_don_ma_cong_thuc_foreign` (`ma_cong_thuc`);

--
-- Chỉ mục cho bảng `video_huong_dan`
--
ALTER TABLE `video_huong_dan`
  ADD PRIMARY KEY (`ma_video`),
  ADD KEY `video_huong_dan_ma_cong_thuc_foreign` (`ma_cong_thuc`);

--
-- Chỉ mục cho bảng `vung_mien`
--
ALTER TABLE `vung_mien`
  ADD PRIMARY KEY (`ma_vung_mien`),
  ADD UNIQUE KEY `vung_mien_ten_vung_mien_unique` (`ten_vung_mien`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `bai_viet`
--
ALTER TABLE `bai_viet`
  MODIFY `ma_bai_viet` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `binh_luan`
--
ALTER TABLE `binh_luan`
  MODIFY `ma_binh_luan` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `binh_luan_bai_viet`
--
ALTER TABLE `binh_luan_bai_viet`
  MODIFY `ma_binh_luan` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `bo_suu_tap`
--
ALTER TABLE `bo_suu_tap`
  MODIFY `ma_bo_suu_tap` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `buoc_thuc_hien`
--
ALTER TABLE `buoc_thuc_hien`
  MODIFY `ma_buoc` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `cong_thuc`
--
ALTER TABLE `cong_thuc`
  MODIFY `ma_cong_thuc` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `danh_gia`
--
ALTER TABLE `danh_gia`
  MODIFY `ma_danh_gia` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `danh_muc`
--
ALTER TABLE `danh_muc`
  MODIFY `ma_danh_muc` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `danh_sach_mua_sam`
--
ALTER TABLE `danh_sach_mua_sam`
  MODIFY `ma_mua_sam` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `hinh_anh_bai_viet`
--
ALTER TABLE `hinh_anh_bai_viet`
  MODIFY `ma_hinh_anh` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `hinh_anh_buoc`
--
ALTER TABLE `hinh_anh_buoc`
  MODIFY `ma_hinh_anh` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `hinh_anh_cong_thuc`
--
ALTER TABLE `hinh_anh_cong_thuc`
  MODIFY `ma_hinh_anh` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT cho bảng `nguoi_dung`
--
ALTER TABLE `nguoi_dung`
  MODIFY `ma_nguoi_dung` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `nguyen_lieu`
--
ALTER TABLE `nguyen_lieu`
  MODIFY `ma_nguyen_lieu` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `the`
--
ALTER TABLE `the`
  MODIFY `ma_the` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `thuc_don`
--
ALTER TABLE `thuc_don`
  MODIFY `ma_thuc_don` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `video_huong_dan`
--
ALTER TABLE `video_huong_dan`
  MODIFY `ma_video` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `vung_mien`
--
ALTER TABLE `vung_mien`
  MODIFY `ma_vung_mien` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `bai_viet`
--
ALTER TABLE `bai_viet`
  ADD CONSTRAINT `bai_viet_ma_nguoi_dung_foreign` FOREIGN KEY (`ma_nguoi_dung`) REFERENCES `nguoi_dung` (`ma_nguoi_dung`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `binh_luan`
--
ALTER TABLE `binh_luan`
  ADD CONSTRAINT `binh_luan_ma_binh_luan_cha_foreign` FOREIGN KEY (`ma_binh_luan_cha`) REFERENCES `binh_luan` (`ma_binh_luan`) ON DELETE CASCADE,
  ADD CONSTRAINT `binh_luan_ma_cong_thuc_foreign` FOREIGN KEY (`ma_cong_thuc`) REFERENCES `cong_thuc` (`ma_cong_thuc`) ON DELETE CASCADE,
  ADD CONSTRAINT `binh_luan_ma_nguoi_dung_foreign` FOREIGN KEY (`ma_nguoi_dung`) REFERENCES `nguoi_dung` (`ma_nguoi_dung`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `binh_luan_bai_viet`
--
ALTER TABLE `binh_luan_bai_viet`
  ADD CONSTRAINT `binh_luan_bai_viet_ma_bai_viet_foreign` FOREIGN KEY (`ma_bai_viet`) REFERENCES `bai_viet` (`ma_bai_viet`) ON DELETE CASCADE,
  ADD CONSTRAINT `binh_luan_bai_viet_ma_binh_luan_cha_foreign` FOREIGN KEY (`ma_binh_luan_cha`) REFERENCES `binh_luan_bai_viet` (`ma_binh_luan`) ON DELETE CASCADE,
  ADD CONSTRAINT `binh_luan_bai_viet_ma_nguoi_dung_foreign` FOREIGN KEY (`ma_nguoi_dung`) REFERENCES `nguoi_dung` (`ma_nguoi_dung`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `bo_suu_tap`
--
ALTER TABLE `bo_suu_tap`
  ADD CONSTRAINT `bo_suu_tap_ma_nguoi_dung_foreign` FOREIGN KEY (`ma_nguoi_dung`) REFERENCES `nguoi_dung` (`ma_nguoi_dung`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `buoc_thuc_hien`
--
ALTER TABLE `buoc_thuc_hien`
  ADD CONSTRAINT `buoc_thuc_hien_ma_cong_thuc_foreign` FOREIGN KEY (`ma_cong_thuc`) REFERENCES `cong_thuc` (`ma_cong_thuc`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `chi_tiet_bo_suu_tap`
--
ALTER TABLE `chi_tiet_bo_suu_tap`
  ADD CONSTRAINT `chi_tiet_bo_suu_tap_ma_bo_suu_tap_foreign` FOREIGN KEY (`ma_bo_suu_tap`) REFERENCES `bo_suu_tap` (`ma_bo_suu_tap`) ON DELETE CASCADE,
  ADD CONSTRAINT `chi_tiet_bo_suu_tap_ma_cong_thuc_foreign` FOREIGN KEY (`ma_cong_thuc`) REFERENCES `cong_thuc` (`ma_cong_thuc`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `cong_thuc`
--
ALTER TABLE `cong_thuc`
  ADD CONSTRAINT `cong_thuc_ma_danh_muc_foreign` FOREIGN KEY (`ma_danh_muc`) REFERENCES `danh_muc` (`ma_danh_muc`) ON DELETE SET NULL,
  ADD CONSTRAINT `cong_thuc_ma_nguoi_dung_foreign` FOREIGN KEY (`ma_nguoi_dung`) REFERENCES `nguoi_dung` (`ma_nguoi_dung`) ON DELETE CASCADE,
  ADD CONSTRAINT `cong_thuc_ma_vung_mien_foreign` FOREIGN KEY (`ma_vung_mien`) REFERENCES `vung_mien` (`ma_vung_mien`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `cong_thuc_nguyen_lieu`
--
ALTER TABLE `cong_thuc_nguyen_lieu`
  ADD CONSTRAINT `cong_thuc_nguyen_lieu_ma_cong_thuc_foreign` FOREIGN KEY (`ma_cong_thuc`) REFERENCES `cong_thuc` (`ma_cong_thuc`) ON DELETE CASCADE,
  ADD CONSTRAINT `cong_thuc_nguyen_lieu_ma_nguyen_lieu_foreign` FOREIGN KEY (`ma_nguyen_lieu`) REFERENCES `nguyen_lieu` (`ma_nguyen_lieu`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `cong_thuc_the`
--
ALTER TABLE `cong_thuc_the`
  ADD CONSTRAINT `cong_thuc_the_ma_cong_thuc_foreign` FOREIGN KEY (`ma_cong_thuc`) REFERENCES `cong_thuc` (`ma_cong_thuc`) ON DELETE CASCADE,
  ADD CONSTRAINT `cong_thuc_the_ma_the_foreign` FOREIGN KEY (`ma_the`) REFERENCES `the` (`ma_the`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `danh_gia`
--
ALTER TABLE `danh_gia`
  ADD CONSTRAINT `danh_gia_ma_cong_thuc_foreign` FOREIGN KEY (`ma_cong_thuc`) REFERENCES `cong_thuc` (`ma_cong_thuc`) ON DELETE CASCADE,
  ADD CONSTRAINT `danh_gia_ma_nguoi_dung_foreign` FOREIGN KEY (`ma_nguoi_dung`) REFERENCES `nguoi_dung` (`ma_nguoi_dung`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `danh_sach_mua_sam`
--
ALTER TABLE `danh_sach_mua_sam`
  ADD CONSTRAINT `danh_sach_mua_sam_ma_nguoi_dung_foreign` FOREIGN KEY (`ma_nguoi_dung`) REFERENCES `nguoi_dung` (`ma_nguoi_dung`) ON DELETE CASCADE,
  ADD CONSTRAINT `danh_sach_mua_sam_ma_nguyen_lieu_foreign` FOREIGN KEY (`ma_nguyen_lieu`) REFERENCES `nguyen_lieu` (`ma_nguyen_lieu`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `hinh_anh_bai_viet`
--
ALTER TABLE `hinh_anh_bai_viet`
  ADD CONSTRAINT `hinh_anh_bai_viet_ma_bai_viet_foreign` FOREIGN KEY (`ma_bai_viet`) REFERENCES `bai_viet` (`ma_bai_viet`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `hinh_anh_buoc`
--
ALTER TABLE `hinh_anh_buoc`
  ADD CONSTRAINT `hinh_anh_buoc_ma_buoc_foreign` FOREIGN KEY (`ma_buoc`) REFERENCES `buoc_thuc_hien` (`ma_buoc`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `hinh_anh_cong_thuc`
--
ALTER TABLE `hinh_anh_cong_thuc`
  ADD CONSTRAINT `hinh_anh_cong_thuc_ma_cong_thuc_foreign` FOREIGN KEY (`ma_cong_thuc`) REFERENCES `cong_thuc` (`ma_cong_thuc`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `theo_doi`
--
ALTER TABLE `theo_doi`
  ADD CONSTRAINT `theo_doi_ma_nguoi_duoc_theo_doi_foreign` FOREIGN KEY (`ma_nguoi_duoc_theo_doi`) REFERENCES `nguoi_dung` (`ma_nguoi_dung`) ON DELETE CASCADE,
  ADD CONSTRAINT `theo_doi_ma_nguoi_theo_doi_foreign` FOREIGN KEY (`ma_nguoi_theo_doi`) REFERENCES `nguoi_dung` (`ma_nguoi_dung`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `thuc_don`
--
ALTER TABLE `thuc_don`
  ADD CONSTRAINT `thuc_don_ma_cong_thuc_foreign` FOREIGN KEY (`ma_cong_thuc`) REFERENCES `cong_thuc` (`ma_cong_thuc`) ON DELETE CASCADE,
  ADD CONSTRAINT `thuc_don_ma_nguoi_dung_foreign` FOREIGN KEY (`ma_nguoi_dung`) REFERENCES `nguoi_dung` (`ma_nguoi_dung`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `video_huong_dan`
--
ALTER TABLE `video_huong_dan`
  ADD CONSTRAINT `video_huong_dan_ma_cong_thuc_foreign` FOREIGN KEY (`ma_cong_thuc`) REFERENCES `cong_thuc` (`ma_cong_thuc`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
