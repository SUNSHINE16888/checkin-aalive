
const IMGUR_CLIENT_ID = "0ecc45a8fb041b";
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx2XEZWfEV_nKsU4danceSwD5Bb-pChs3o5qvVYCXeczPubdJ1gOTupd4wnq3XHr1xr/exec";

document.getElementById('attendanceForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const shift = document.getElementById('shift').value;
  const note = document.getElementById('note').value;
  const photoFile = document.getElementById('photo').files[0];

  if (!photoFile) {
    alert("Vui lòng chọn ảnh.");
    return;
  }

  // 1. Upload ảnh lên Imgur
  const formData = new FormData();
  formData.append("image", photoFile);

  let photoUrl = "";
  try {
    const imgurRes = await fetch("https://api.imgur.com/3/image", {
      method: "POST",
      headers: {
        Authorization: "Client-ID " + IMGUR_CLIENT_ID
      },
      body: formData
    });
    const imgurData = await imgurRes.json();
    photoUrl = imgurData.data.link;
  } catch (err) {
    alert("Lỗi khi upload ảnh lên Imgur!");
    return;
  }

  // 2. Gửi thông tin tới Google Sheet
  const payload = {
    name,
    shift,
    note,
    photo: photoUrl
  };

  const response = await fetch(SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (response.ok) {
    alert("Điểm danh thành công!");
    document.getElementById('attendanceForm').reset();
  } else {
    alert("Gửi thất bại!");
  }
});
