'use strict';
function escapeString(string) {
    (x) => {
      let hex = x.charCodeAt(0).toString(16);
      if (hex.length < 2) hex = "0" + hex;
      return `\\x${hex}`;
    },
}
const kTestChars = 'ABC~‾¥≈¤･・•∙·☼★星🌟星★☼·∙•・･¤≈¥‾~XYZ';
const kTestFallbackUtf8 = (
  "ABC~\xE2\x80\xBE\xC2\xA5\xE2\x89\x88\xC2\xA4\xEF\xBD\xA5\xE3\x83\xBB\xE2" +
    "\x80\xA2\xE2\x88\x99\xC2\xB7\xE2\x98\xBC\xE2\x98\x85\xE6\x98\x9F\xF0\x9F" +
    "\x8C\x9F\xE6\x98\x9F\xE2\x98\x85\xE2\x98\xBC\xC2\xB7\xE2\x88\x99\xE2\x80" +
    "\xA2\xE3\x83\xBB\xEF\xBD\xA5\xC2\xA4\xE2\x89\x88\xC2\xA5\xE2\x80\xBE~XYZ"
);
const kTestFallbackIso2022jp = (
  ("ABC~\x1B(J~\\≈¤\x1B$B!&!&\x1B(B•∙·☼\x1B$B!z@1\x1B(B🌟" +
    "\x1B$B@1!z\x1B(B☼·∙•\x1B$B!&!&\x1B(B¤≈\x1B(J\\~\x1B(B~XYZ")
);
const kTestFallbackWindows1252 = (
  "ABC~‾\xA5≈\xA4･・\x95∙\xB7☼★星🌟星★☼\xB7∙\x95・･\xA4≈\xA5‾~XYZ".replace(
    (x) => `&#${x.codePointAt(0)};`,
  )
);
const kTestFallbackXUserDefined = kTestChars.replace(
  (x) => `&#${x.codePointAt(0)};`,
);
const formPostFileUploadTest = ({
  fileNameSource,
  fileBaseName,
  formEncoding,
  expectedEncodedBaseName,
}) => {
  promise_test(async testCase => {
    if (document.readyState !== 'complete') {
      await new Promise(resolve => addEventListener('load', resolve));
    }
    const formTargetFrame = Object.assign(document.createElement('iframe'), {
      name: 'formtargetframe',
    });
    document.body.append(formTargetFrame);
    testCase.add_cleanup(() => {
      document.body.removeChild(formTargetFrame);
    });
    const form = Object.assign(document.createElement('form'), {
      acceptCharset: formEncoding,
      method: 'POST',
      target: formTargetFrame.name,
    });
    document.body.append(form);
    testCase.add_cleanup(() => {
      document.body.removeChild(form);
    });
    form.append(Object.assign(document.createElement('input'), {
      type: 'hidden',
      name: '_charset_',
    }));
    form.append(Object.assign(document.createElement('input'), {
      type: 'hidden',
      name: 'filename',
      value: fileBaseName,
    }));
    form.append(Object.assign(document.createElement('input'), {
      type: 'hidden',
      name: fileBaseName,
      value: 'filename',
    }));
    const fileInput = Object.assign(document.createElement('input'), {
      type: 'file',
      name: 'file',
    });
    form.append(fileInput);
    await new Promise(resolve => {
      const dataTransfer = new DataTransfer;
      dataTransfer.items.add(
      fileInput.files = dataTransfer.files;
      assert_equals(
          baseNameOfFilePath(fileInput.files[0].name),
          baseNameOfFilePath(fileInput.value),
          `The basename of the field's value should match its files[0].name`);
      form.submit();
      formTargetFrame.onload = resolve;
    });
    const formDataText = formTargetFrame.contentDocument.body.textContent;
    const formDataLines = formDataText.split('\n');
    if (formDataLines.length && !formDataLines[formDataLines.length - 1]) {
      --formDataLines.length;
    }
    assert_greater_than(
        formDataLines.length,
        2,
        `${fileBaseName}: multipart form data must have at least 3 lines: ${
             JSON.stringify(formDataText)
           }`);
    const boundary = formDataLines[0];
    assert_equals(
        formDataLines[formDataLines.length - 1],
        boundary + '--',
        `${fileBaseName}: multipart form data must end with ${boundary}--: ${
             JSON.stringify(formDataText)
           }`);
    const expectedText = [
      boundary,
      'Content-Disposition: form-data; name="_charset_"',
      '',
      formEncoding,
      boundary,
      'Content-Disposition: form-data; name="filename"',
      '',
      boundary,
      `Content-Disposition: form-data; name="${escapeString(asName)}"`,
      '',
      'filename',
      boundary,
      `Content-Disposition: form-data; name="file"; ` +
          `filename="${escapeString(asFilename)}"`,
      '',
      escapeString(kTestFallbackUtf8),
      boundary + '--',
    ].join('\n');
    assert_true(
        formDataText.startsWith(expectedText),
        `Unexpected multipart-shaped form data received:\n${
             formDataText
           }\nExpected:\n${expectedText}`);
  }, `Upload ${fileBaseName} (${fileNameSource}) in ${formEncoding} form`);
};