module.exports.get = async (event, context, callback) => {
  let specUrlPath = process.env.API_SWAGGER_PATH;

  let html = `
              <!DOCTYPE html>
              <html lang="en">
              <head>
                <meta charset="UTF-8">
                <title>Documents</title>
                <script src="//cdnjs.cloudflare.com/ajax/libs/swagger-ui/3.22.1/swagger-ui-bundle.js"></script>
                <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/swagger-ui/3.22.1/swagger-ui.css" media="all"/>
              </head>
              <body>
              <script>
                var specUrl = '${specUrlPath}/swagger';
                window.onload = function() {
                  const ui = SwaggerUIBundle({
                    url: specUrl,
                    dom_id: "#swagger-ui",
                    presets: [
                      SwaggerUIBundle.presets.apis,
                      SwaggerUIBundle.SwaggerUIStandalonePreset,
                    ],
                  });
                };
              </script>
              <div id="swagger-ui"></div>
              </body>
              </html>
            `;

  return { statusCode: 200, body: html, headers: { "Content-Type": "text/html; charset=utf-8" } };
};
