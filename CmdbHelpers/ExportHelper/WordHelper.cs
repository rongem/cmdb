using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CmdbHelpers.ExportHelper
{
    public class WordHelper : IDisposable
    {
        private WordprocessingDocument wordprocessingDocument;

        private Dictionary<string, Bookmark> bookmarkMap;

        public class Bookmark
        {
            public BookmarkStart bookmarkStart;
            public BookmarkEnd bookmarkEnd;
        }

        public IEnumerable<string> BookmarkNames
        {
            get { return bookmarkMap.Keys; }
        }

        public class ParagraphText
        {
            public ParagraphText(string templateName, string text)
            {
                TemplateName = templateName;
                Text = text;
            }

            public string TemplateName { get; set; }
            public string Text { get; set; }
        }

        public void CreateAndWordDocumentToStream(System.IO.Stream stream, string[] textLines)
        {
            using (WordprocessingDocument doc = WordprocessingDocument.Create(stream, WordprocessingDocumentType.Document))
            {
                new Document(new Body()).Save(doc.AddMainDocumentPart());

                Body body = doc.MainDocumentPart.Document.Body;

                //AddStylesPartToPackage(doc);

                for (int i = 0; i < textLines.Length; i++)
                {
                    Paragraph p = body.AppendChild(new Paragraph());
                    //p.ParagraphProperties = new ParagraphProperties(new ParagraphStyleId() { Val = line.TemplateName });
                    Run r = p.AppendChild(new Run());
                    r.AppendChild(new Text(textLines[i]));
                }

                doc.Close();
            }
        }

        public void OpenDocument(string filePath, bool findBookmarks)
        {
            wordprocessingDocument = WordprocessingDocument.Open(filePath, false);
            if (findBookmarks)
            {
                bookmarkMap = new Dictionary<string, Bookmark>();
                List<BookmarkEnd> bme = new List<BookmarkEnd>();
                bme.AddRange(wordprocessingDocument.MainDocumentPart.RootElement.Descendants<BookmarkEnd>());
                foreach (BookmarkStart bookmarkStart in wordprocessingDocument.MainDocumentPart.RootElement.Descendants<BookmarkStart>())
                {
                    if (bookmarkStart.Name.Equals("_GoBack"))
                        continue;
                    Bookmark bm = new Bookmark() { bookmarkStart = bookmarkStart, bookmarkEnd = bme.Single(b => b.Id.InnerText.Equals(bookmarkStart.Id.InnerText)) };
                    bookmarkMap[bookmarkStart.Name] = bm;
                }
            }
        }

        public string GetBookmarkContent(string bookmarkLabel)
        {
            if (bookmarkMap == null)
                return null;
            if (!bookmarkMap.ContainsKey(bookmarkLabel))
                return null;
            Bookmark bookmark = bookmarkMap[bookmarkLabel];
            IEnumerable<Paragraph> bookmarkParagraphs = wordprocessingDocument.MainDocumentPart.RootElement.Descendants().Where(e => (e == bookmark.bookmarkStart.Parent || e.IsAfter(bookmark.bookmarkStart)) && (e.IsBefore(bookmark.bookmarkEnd) || e == bookmark.bookmarkEnd.Parent)).OfType<Paragraph>();
            StringBuilder sb = new StringBuilder();
            foreach (Paragraph para in bookmarkParagraphs)
            {
                foreach (Run run in para.Descendants<Run>())
                {
                    if (run.IsAfter(bookmark.bookmarkStart) && run.IsBefore(bookmark.bookmarkEnd))
                        sb.Append(run.InnerText);
                }
                sb.AppendLine();
            }
            return sb.ToString();
        }

        // Add a StylesDefinitionsPart to the document.  Returns a reference to it.
        public static StyleDefinitionsPart AddStylesPartToPackage(WordprocessingDocument doc)
        {
            StyleDefinitionsPart part;
            part = doc.MainDocumentPart.AddNewPart<StyleDefinitionsPart>();
            Styles root = new Styles();
            root.Save(part);
            return part;
        }

        private static Style CreateStyle(string styleName, string styleId, string fontName, string fontSize, bool bold, bool italic)
        {
            Style style = new Style()
            {
                Type = StyleValues.Paragraph,
                StyleId = styleId,
                CustomStyle = true
            };
            StyleName styleName1 = new StyleName() { Val = styleName };
            style.Append(styleName1);
            StyleRunProperties styleRunProperties = new StyleRunProperties();
            if (bold)
                styleRunProperties.Append(new Bold());
            if (italic)
                styleRunProperties.Append(new Italic());
            styleRunProperties.Append(new RunFonts() { Ascii = fontName });
            styleRunProperties.Append(new FontSize() { Val = fontSize });  // Sizes are in half-points. Oy!
            style.Append(styleRunProperties);
            return style;
        }

        #region IDisposable Support
        private bool disposedValue = false; // To detect redundant calls

        protected virtual void Dispose(bool disposing)
        {
            if (!disposedValue)
            {
                if (disposing)
                {
                    if (wordprocessingDocument != null)
                        wordprocessingDocument.Dispose();
                }
                disposedValue = true;
            }
        }

        // This code added to correctly implement the disposable pattern.
        public void Dispose()
        {
            Dispose(true);
        }
        #endregion
    }
}
