import React from "react";
import {
  Button,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
  Box,
  Card,
  CardContent,
  Divider,
  Chip,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Article as ArticleIcon,
  Title as TitleIcon,
  Category as CategoryIcon,
  PhotoCamera as PhotoCameraIcon,
  Tag as TagIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import LaTeXToolbar from "./LaTeXToolbar";
import LaTeXPreview from "./LaTeXPreview";

const statusOptions = [
  { value: "DRAFT", label: "Bản nháp" },
  { value: "PUBLISHED", label: "Xuất bản" },
  { value: "ARCHIVED", label: "Lưu trữ" },
];

const categoryOptions = [
  "Tin giáo dục",
  "Đề án tuyển sinh",
  "Kỳ thi HSA",
  "Kỳ thi TSA",
];

const quillModules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image", "video"],
    ["clean"],
  ],
  clipboard: {
    matchVisual: false,
  },
};

const quillFormats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
];

export default function BlogForm({
  formData,
  errors,
  handleChangeInput,
  handleInsertBlog,
  isEditing,
  handleUpdateBlog,
  uploadImageBlog,
  imageRefBlog,
  handleContentChange,
  handleTagsChange,
}) {
  const quillRef = React.useRef(null);
  const [showPreview, setShowPreview] = React.useState(false);

  const handleQuillChange = (content) => {
    handleContentChange(content);
  };

  const handleTogglePreview = () => {
    setShowPreview(!showPreview);
  };

  const handleInsertLaTeX = (template) => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection();
      const index = range ? range.index : quill.getLength();

      // Insert the LaTeX template at cursor position
      quill.insertText(index, template, "user");

      // Set cursor position after the inserted text
      quill.setSelection(index + template.length);

      // Focus back to editor
      quill.focus();

      // Update the form data
      handleContentChange(quill.root.innerHTML);
    }
  };

  const handleTagInputKeyPress = (event) => {
    if (event.key === "Enter" && event.target.value.trim()) {
      event.preventDefault();
      const newTag = event.target.value.trim();
      const currentTags = formData?.tags || [];
      if (!currentTags.includes(newTag)) {
        handleTagsChange([...currentTags, newTag]);
      }
      event.target.value = "";
    }
  };

  const removeTag = (tagToRemove) => {
    const currentTags = formData?.tags || [];
    handleTagsChange(currentTags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur">
          <CardContent className="text-center py-8">
            <div className="mb-4">
              <ArticleIcon className="text-6xl text-purple-500 mx-auto" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              {isEditing ? "Cập nhật bài viết" : "Tạo bài viết mới"}
            </h1>
            <p className="text-gray-600 text-lg">
              {isEditing
                ? "Chỉnh sửa thông tin bài viết"
                : "Tạo bài viết mới cho blog"}
            </p>
          </CardContent>
        </Card>

        {/* Main Form */}
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur">
          <CardContent className="p-8">
            {/* Basic Information Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <TitleIcon className="mr-3 text-purple-500" />
                Thông tin cơ bản
              </h2>

              <div className="grid grid-cols-1 gap-6">
                <TextField
                  label="Tiêu đề bài viết *"
                  name="title"
                  value={formData?.title || ""}
                  error={errors?.title}
                  helperText={
                    errors?.title
                      ? "Tiêu đề bài viết là bắt buộc"
                      : "Tiêu đề hiển thị của bài viết"
                  }
                  onChange={handleChangeInput}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <TitleIcon className="text-purple-500" />
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  className="bg-white"
                  fullWidth
                />

                <TextField
                  label="Tóm tắt bài viết *"
                  name="excerpt"
                  value={formData?.excerpt || ""}
                  error={errors?.excerpt}
                  helperText={
                    errors?.excerpt
                      ? "Tóm tắt là bắt buộc"
                      : "Mô tả ngắn gọn về nội dung bài viết"
                  }
                  onChange={handleChangeInput}
                  variant="outlined"
                  className="bg-white"
                  fullWidth
                  multiline
                  rows={3}
                />
              </div>
            </div>

            <Divider className="my-8" />

            {/* Content Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <ArticleIcon className="mr-3 text-purple-500" />
                Nội dung bài viết
              </h2>

              {/* LaTeX Toolbar */}
              <LaTeXToolbar onInsert={handleInsertLaTeX} />

              <div className="bg-white rounded-lg border border-gray-200">
                <Typography
                  variant="subtitle2"
                  className="text-gray-600 p-4 pb-2"
                  component="label"
                >
                  Nội dung HTML + LaTeX *
                </Typography>
                <div className="px-4 pb-4">
                  <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    value={formData?.content || ""}
                    onChange={handleQuillChange}
                    modules={quillModules}
                    formats={quillFormats}
                    style={{ height: "400px", marginBottom: "50px" }}
                    placeholder="Viết nội dung bài viết của bạn... Sử dụng $ cho công thức laTeX"
                  />
                </div>
                {errors?.content && (
                  <Typography
                    variant="caption"
                    color="error"
                    className="px-4 pb-2 block"
                  >
                    Nội dung bài viết là bắt buộc
                  </Typography>
                )}
              </div>

              {/* LaTeX Preview */}
              <LaTeXPreview
                content={formData?.content || ""}
                showPreview={showPreview}
                onTogglePreview={handleTogglePreview}
              />
            </div>

            <Divider className="my-8" />

            {/* Category and Status Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <CategoryIcon className="mr-3 text-purple-500" />
                Phân loại và trạng thái
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TextField
                  select
                  label="Danh mục *"
                  name="category"
                  value={formData?.category || ""}
                  error={errors?.category}
                  helperText={
                    errors?.category
                      ? "Danh mục là bắt buộc"
                      : "Chọn danh mục cho bài viết"
                  }
                  onChange={handleChangeInput}
                  variant="outlined"
                  className="bg-white"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                >
                  {categoryOptions.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  label="Trạng thái *"
                  name="status"
                  value={formData?.status || "DRAFT"}
                  error={errors?.status}
                  helperText={
                    errors?.status
                      ? "Trạng thái là bắt buộc"
                      : "Trạng thái xuất bản của bài viết"
                  }
                  onChange={handleChangeInput}
                  variant="outlined"
                  className="bg-white"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                >
                  {statusOptions.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
            </div>

            <Divider className="my-8" />

            {/* Tags Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <TagIcon className="mr-3 text-purple-500" />
                Thẻ (Tags)
              </h2>

              <TextField
                label="Thêm thẻ"
                placeholder="Nhập thẻ và nhấn Enter"
                onKeyPress={handleTagInputKeyPress}
                variant="outlined"
                className="bg-white mb-4"
                fullWidth
                helperText="Nhập thẻ và nhấn Enter để thêm"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TagIcon className="text-purple-500" />
                    </InputAdornment>
                  ),
                }}
              />

              {formData?.tags && formData.tags.length > 0 && (
                <Box className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      onDelete={() => removeTag(tag)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              )}
            </div>

            <Divider className="my-8" />

            {/* Image Upload Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <PhotoCameraIcon className="mr-3 text-purple-500" />
                Ảnh đại diện
              </h2>

              <Box className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
                <PhotoCameraIcon className="text-4xl text-gray-400 mb-2" />
                <Typography className="text-gray-600 mb-3">
                  {formData?.imgUrl ? "Đã có ảnh đại diện" : "Chưa chọn ảnh"}
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => imageRefBlog.current?.click()}
                  className="bg-purple-500 hover:bg-purple-600"
                  startIcon={<CloudUploadIcon />}
                >
                  {formData?.imgUrl ? "Thay đổi ảnh" : "Chọn ảnh"}
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  ref={imageRefBlog}
                  onChange={uploadImageBlog}
                  className="hidden"
                />
              </Box>

              {formData?.imgUrl && (
                <div className="mt-4">
                  <img
                    src={formData.imgUrl}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                </div>
              )}
            </div>

            <Divider className="my-8" />

            {/* Submit Section */}
            <div className="flex justify-center">
              {isEditing ? (
                <Button
                  variant="contained"
                  onClick={handleUpdateBlog}
                  startIcon={<CloudUploadIcon />}
                  className="bg-purple-600 hover:bg-purple-700 py-4 px-8 text-lg"
                  size="large"
                >
                  Cập nhật bài viết
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleInsertBlog}
                  startIcon={<CloudUploadIcon />}
                  className="bg-green-600 hover:bg-green-700 py-4 px-8 text-lg"
                  size="large"
                >
                  Tạo bài viết
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
