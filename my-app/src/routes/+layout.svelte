<script>
    import '../app.css';
    
    let { children } = $props();
</script>
<!-- 
<head>
    <title>CountryGUESSR</title>
    <meta charset="UTF-8">
    <meta name="author" content="Gregory Payton">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head> -->

<nav class="flex justify-around p-2 bg-slate-100">
    <div>
        <a href="/" class="text-cyan-800 text-3xl">CountryGUESSR</a>
    </div>
     <div class="wide-menu">
                <a href="/profile" class="underline">Profile</a>
    </div>
</nav>

<section id="center-screen" class="m-2 max-h-[90vh] overflow-auto">
 {@render children()}
</section>

 <style>
 </style>
