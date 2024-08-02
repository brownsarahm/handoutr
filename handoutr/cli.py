import click 
import os
from .builder import build_page
from .utils import load_template_file

@click.group
def handoutr_base():
    pass 


@handoutr_base.command()
@click.argument('filename', type=click.Path(exists=True))
def build(filename):
    '''
    '''

    
    with open(filename,'r') as f:
        file_text = f.read()
    
    handout_html = build_page(file_text)

    # set to copy js and css while writing and mka dir if needed
    out_dir = os.path.join('html')
    out_path = os.path.join(out_dir,'index.html')
    with open(out_path,'w') as f:
        f.write(handout_html)

    supporting_file_list = ['handout.js','handout.css']
    for file in supporting_file_list:
        file_content = load_template_file(file)
        with open(os.path.join(out_dir,file),'w') as f:
            f.write(file_content)
    # click.echo(handout_html)
